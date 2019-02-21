package com.bbq;

import com.bbq.BaseHttpConnection;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

public class DownloadImageDemo {
    // private static BaseHttpConnection baseHttpConnection = new BaseHttpConnection();
    // public static boolean downloadImage(String url, String fileName){

    //     File file = new File(fileName);
    //     // 检查文件是否存在,如不存在则会创建空文件
    //     if(!file.exists()){
    //         try{
    //             if(!file.createNewFile()){
    //                 // 文件创建失败,请检查目录是否正确以及权限
    //                 return false;
    //             }
    //         }catch (IOException ioe){
    //             ioe.printStackTrace();
    //             return false;
    //         }
    //     }
    //     BufferedOutputStream bufferedOutputStream = null;
    //     try{
    //         // 构造请求头
    //         HashMap<String, String> header = new HashMap<>();
    //         header.put("Referer", "http://localhost/");
    //         // 发送请求
    //         byte[] rawData = baseHttpConnection.getRawBytes(url, header);
    //         // 写入文件,这种写法会覆盖掉原有文件
    //         bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(file));
    //         bufferedOutputStream.write(rawData);
    //         bufferedOutputStream.flush();
    //     }catch (IOException ioe){
    //         ioe.printStackTrace();
    //         return false;
    //     }catch (Exception e){
    //         e.printStackTrace();
    //         return false;
    //     }finally {
    //         try{
    //             if(bufferedOutputStream != null)
    //                 bufferedOutputStream.close();
    //         }catch (IOException ioe2){
    //         }
    //     }
    //     return true;
    // }


    // public static void main(String[] args){

    //     String url = "https://static-img.wutnews.net/image/213ce285-391f-4400-a901-5815c1887858-60-100.webp";
    //     // Windows下类似这样
    //     String fileFullPath1 = "D:/213ce285-391f-4400-a901-5815c1887858-60-100.webp";
    //     // Android(Linux)下类似这样(SD卡根目录)
    //     String fileFullPath2 = "/sdcard/000.jpg";

    //     if(downloadImage(url,fileFullPath1)){
    //         System.out.println("图片下载成功");
    //     }else{
    //         System.out.println("图片下载失败");
    //     }
    // }

}
