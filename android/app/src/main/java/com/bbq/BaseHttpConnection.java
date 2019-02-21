package com.bbq;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.zip.GZIPInputStream;

/**
 *  Http请求工具类,使用Java原生HttpURLConnection包装而成
 *  author: initialize
 *  2018.05.06
 */
public class BaseHttpConnection {

    public class ResponseEntity{
        public int code;
        public Map<String, List<String>> headerMap;
        public String redirectUrl;
        public String htmlBody;
        @Override
        public String toString(){
            return this.htmlBody;
        }
    }

    public static final String[] USERAGENT_LIST = {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
            "Mozilla/5.0 (Linux; Android 6.0.1; MI 6 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Tablet PC 2.0; rv:11.0) like Gecko",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3533.15 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3526.69 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0",
            "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Tablet PC 2.0; rv:11.0) like Gecko",
    };


    private String USERAGENT = "";

    public static final String DEFAULT_CHARSET = "UTF-8";
    public static final int MAX_REDIRECT_TIMES = 5;
    public static final int DEFAULT_CONNECT_TIMEOUT = 7000;
    public static final int DEFAULT_READ_TIMEOUT = 10000;
    private int connectTimeout;
    private int readTimeout;
    //public static final int DEFAULT_CONNECT_TIMEOUT = 8000;
    //public static final int DEFAULT_READ_TIMEOUT = 11000;
    private ZRCookie zrCookie = new ZRCookie();
    private boolean instanceFollowRedirects;

    public void setTimeout(int connectTimeout, int readTimeout){
        if(connectTimeout > 50 && connectTimeout < 60000)
            this.connectTimeout = connectTimeout;
        else
            this.connectTimeout = DEFAULT_CONNECT_TIMEOUT;

        if(readTimeout > 50 && readTimeout < 60000)
            this.readTimeout = readTimeout;
        else
            this.readTimeout = DEFAULT_READ_TIMEOUT;
    }

    public BaseHttpConnection(){
        setInstanceFollowRedirects(true);
        setTimeout(DEFAULT_CONNECT_TIMEOUT, DEFAULT_READ_TIMEOUT);
        // 取随机UA
        USERAGENT = USERAGENT_LIST[new Random().nextInt(USERAGENT_LIST.length)];

        try{
            // 信任所有证书,但有安全隐患
            SSLContext sc = SSLContext.getInstance("SSL");
            X509TrustManager x509TrustManager = new X509TrustManager() {
                @Override
                public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {

                }

                @Override
                public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {

                }

                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
            };
            sc.init(null, new TrustManager[]{x509TrustManager}, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // 这里暂时返回为true,但有安全隐患
            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });
        }catch (NoSuchAlgorithmException nsae){
            nsae.printStackTrace();
        }catch (KeyManagementException kme){
            kme.printStackTrace();
        }

    }

    public void setInstanceFollowRedirects(boolean b){
        instanceFollowRedirects = b;
    }

    public ResponseEntity post(String url, String params) throws Exception {
        return post(url, params, null);
    }

    public ResponseEntity post(String url, Map<String, String> params) throws Exception {
        return post(url, getBodyStr(params), null);
    }

    public ResponseEntity post(String url, Map<String,String> params, Map<String,String> headers) throws Exception {
        return post(url, getBodyStr(params), headers);
    }

    public ResponseEntity post(String url, String params, Map<String,String> headers) throws Exception {

        URL loginUrl = new URL(url);

        HttpURLConnection connection = (HttpURLConnection) loginUrl.openConnection();

        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setRequestMethod("POST");
        connection.setUseCaches(false);
        connection.setConnectTimeout(connectTimeout);
        connection.setReadTimeout(readTimeout);
        connection.setInstanceFollowRedirects(instanceFollowRedirects);

        if (headers == null || headers.isEmpty()){
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        } else {
            for(String key:headers.keySet()){
                connection.setRequestProperty(key, headers.get(key));
            }
        }

        /*headers中的Cookie以及User-Agent会被覆盖掉*/
        connection.setRequestProperty("Cookie",getFormattedCookie(zrCookie.get(loginUrl)));
        connection.setRequestProperty("User-Agent",USERAGENT);
        connection.setRequestProperty("Host",loginUrl.getHost());

        if(params == null){
            params = "";
        }
        String requestBody = params;
        PrintWriter printWriter = new PrintWriter(connection.getOutputStream());
        printWriter.write(requestBody);
        printWriter.flush();

        InputStream is = connection.getInputStream();

        Map<String, List<String>> map = connection.getHeaderFields();
        List<String> cookieList = map.get("Set-Cookie");
        if(cookieList != null){
            zrCookie.set(loginUrl,cookieList);
        }

        // 检查返回数据是否为经过gzip压缩
        boolean returnedDataUseGzip = false;
        List<String> contentEncodingList = map.get("Content-Encoding");
        if(contentEncodingList == null){
            contentEncodingList = map.get("content-encoding");
        }
        if(contentEncodingList != null){
            for(String ss : contentEncodingList){
                if(ss.toLowerCase().contains("gzip")){
                    returnedDataUseGzip = true;
                    break;
                }
            }
        }


        if(returnedDataUseGzip){
            System.out.println("Content-Encoding : gzip");
            GZIPInputStream ungzip = new GZIPInputStream(is);
            is = ungzip;
        }

        String body = readStringFromStream(is);
        connection.disconnect();

        ResponseEntity responseEntity = new ResponseEntity();
        responseEntity.code = connection.getResponseCode();
        responseEntity.headerMap = map;
        responseEntity.redirectUrl = null == map.get("Location") ? null : map.get("Location").get(0);
        responseEntity.htmlBody = body;

        return responseEntity;
    }

    public ResponseEntity get(String url) throws Exception {
        return get(url, null);
    }

    public ResponseEntity get(String url, Map<String,String> headers) throws Exception {

        URL loginUrl = new URL(url);

        HttpURLConnection connection = (HttpURLConnection) loginUrl.openConnection();

        connection.setDoInput(true);
        connection.setRequestMethod("GET");
        connection.setUseCaches(false);
        connection.setConnectTimeout(connectTimeout);
        connection.setReadTimeout(readTimeout);
        connection.setInstanceFollowRedirects(instanceFollowRedirects);

        if (headers == null || headers.isEmpty()){
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("Content-Type", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        } else {
            for(String key:headers.keySet()){
                connection.setRequestProperty(key, headers.get(key));
            }
        }

        connection.setRequestProperty("User-Agent",USERAGENT);
        connection.setRequestProperty("Cookie",getFormattedCookie(zrCookie.get(loginUrl)));
        connection.setRequestProperty("Host",loginUrl.getHost());

        InputStream is = connection.getInputStream();

        Map<String, List<String>> map = connection.getHeaderFields();
        List<String> cookieList = map.get("Set-Cookie");
        if(cookieList != null){
            zrCookie.set(loginUrl,cookieList);
        }

        // 检查返回数据是否为经过gzip压缩
        boolean returnedDataUseGzip = false;
        List<String> contentEncodingList = map.get("Content-Encoding");
        if(contentEncodingList == null){
            contentEncodingList = map.get("content-encoding");
        }
        if(contentEncodingList != null){
            for(String ss : contentEncodingList){
                if(ss.toLowerCase().contains("gzip")){
                    returnedDataUseGzip = true;
                    break;
                }
            }
        }


        if(returnedDataUseGzip){
            System.out.println("Content-Encoding : gzip");
            GZIPInputStream ungzip = new GZIPInputStream(is);
            is = ungzip;
        }

        String body = readStringFromStream(is);
        connection.disconnect();

        ResponseEntity responseEntity = new ResponseEntity();
        responseEntity.code = connection.getResponseCode();
        responseEntity.headerMap = map;
        responseEntity.redirectUrl = null == map.get("Location") ? null : map.get("Location").get(0);
        responseEntity.htmlBody = body;

        return responseEntity;
    }

    public byte[] getRawBytes(String url) throws Exception{
        return getRawBytes(url, null);
    }

    public byte[] getRawBytes(String url, Map<String,String> headers) throws Exception {

        URL loginUrl = new URL(url);

        HttpURLConnection connection = (HttpURLConnection) loginUrl.openConnection();

        connection.setDoInput(true);
        connection.setRequestMethod("GET");
        connection.setUseCaches(false);
        connection.setInstanceFollowRedirects(instanceFollowRedirects);
        connection.setRequestProperty("Connection", "Keep-Alive");
        connection.setRequestProperty("Content-Type", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        connection.setRequestProperty("User-Agent",USERAGENT);

        if (headers == null || headers.isEmpty()){
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("Content-Type", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        } else {
            for(String key:headers.keySet()){
                connection.setRequestProperty(key, headers.get(key));
            }
        }

        connection.setRequestProperty("Cookie",getFormattedCookie(zrCookie.get(loginUrl)));

        InputStream is = connection.getInputStream();

        Map<String, List<String>> map = connection.getHeaderFields();
        List<String> cookieList = map.get("Set-Cookie");
        if(cookieList != null){
            zrCookie.set(loginUrl,cookieList);
        }


        // 检查返回数据是否为经过gzip压缩
        boolean returnedDataUseGzip = false;
        List<String> contentEncodingList = map.get("Content-Encoding");
        if(contentEncodingList == null){
            contentEncodingList = map.get("content-encoding");
        }
        if(contentEncodingList != null){
            for(String ss : contentEncodingList){
                if(ss.toLowerCase().contains("gzip")){
                    returnedDataUseGzip = true;
                    break;
                }
            }
        }


        if(returnedDataUseGzip){
            System.out.println("Content-Encoding : gzip");
            GZIPInputStream ungzip = new GZIPInputStream(is);
            is = ungzip;
        }

        byte[] content = toByteArray(is);
        connection.disconnect();

        return content;
    }

    public ResponseEntity getAutoRedirect(String url)throws Exception{
        ResponseEntity re = get(url);
        int i = 0;
        while(re.redirectUrl != null) {
            if(i > MAX_REDIRECT_TIMES){
                throw new Exception(BaseHttpConnection.class.getName()+" 超过最大重定向次数!\n");
            }
            re = get(re.redirectUrl);
        }
        return re;
    }

    private String getFormattedCookie(List<String> cookieList){
        if(cookieList == null || cookieList.isEmpty()){
            return "";
        }
        int n = cookieList.size();
        StringBuilder stringBuilder = new StringBuilder();
        for(int i = 0; i < n;i++){
            String item = cookieList.get(i);
            if(null != item && item.length() != 0 && item.contains(";") && item.contains("=")){
                stringBuilder.append(item.substring(0,item.indexOf(';'))).append(';');
            }else{
                System.out.println("CookieFormatError :\n"+item);
            }
        }
        return stringBuilder.toString();
    }

    private String readStringFromStream(InputStream is) throws IOException {

        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int length;
        while ((length = is.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        return result.toString("UTF-8");
//
//        if(is == null){
//            return "";
//        }
//        BufferedReader br = new BufferedReader(new InputStreamReader(is));
//        String s;
//        StringBuilder responseContent = new StringBuilder();
//        while(null != (s = br.readLine())){
//            responseContent.append(s).append('\n');
//        }
//        return responseContent.toString();
    }


    public JSONObject getAllCookie(){
        return this.zrCookie.toJSONObject();
    }


    private static byte[] toByteArray(InputStream input)
            throws IOException
    {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        copy(input, output);
        return output.toByteArray();
    }

    private static int copy(InputStream input, OutputStream output)
            throws IOException
    {
        long count = copyLarge(input, output);
        if (count > 2147483647L) {
            return -1;
        }
        return (int)count;
    }

    private static long copyLarge(InputStream input, OutputStream output)
            throws IOException
    {
        byte[] buffer = new byte[4096];
        long count = 0L;
        int n = 0;
        while (-1 != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
            count += n;
        }
        return count;
    }

    public static String getBodyStr(Map<String,String> params){
        if (params == null || params.isEmpty()){
            return "";
        }
        StringBuilder paramsStringBuilder = new StringBuilder();
        for (String key:params.keySet()) {
            try{
                paramsStringBuilder
                        .append(URLEncoder.encode(key,DEFAULT_CHARSET))
                        .append('=')
                        .append(URLEncoder.encode(params.get(key),DEFAULT_CHARSET))
                        .append('&');
            }catch (UnsupportedEncodingException uee){
                uee.printStackTrace();
            }
        }
        return paramsStringBuilder.toString();
    }



    /*用于BaseHttpConnection的Cookie类*/
    class ZRCookie{
        private SortedMap<String,List<String>> cookieTable = new TreeMap<String, List<String>>();

        public ZRCookie(){

        }

        public List<String> get(String host){
            if(host == null) return null;
            return cookieTable.get(host);
        }

        public List<String> get(URL url){
            if(url == null) return null;
            return get(url.getHost());
        }

        public void set(String host,List<String> cookieList){
            if(host == null) return;
            cookieTable.put(host,cookieList);
        }

        public void set(URL url, List<String> cookieList){
            if(url == null) return;
            set(url.getHost(),cookieList);
        }

        @Override
        public String toString(){
            return this.toJSONObject().toString();
        }

        public JSONObject toJSONObject(){
            JSONObject jsonObject = new JSONObject();
            Set<String> set = cookieTable.keySet();
            for (String host: set) {
                try{
                    List<String> cookieList = cookieTable.get(host);
                    if(cookieList == null){
                        continue;
                    }
                    JSONArray jsonArray = new JSONArray();
                    Iterator iterator = cookieList.iterator();
                    while(iterator.hasNext()){
                        jsonArray.put(iterator.next());
                    }
                    jsonObject.put(host,jsonArray);
                }catch (JSONException je){
                    je.printStackTrace();
                }
            }
            return jsonObject;
        }

    }
}