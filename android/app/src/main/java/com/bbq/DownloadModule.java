package com.bbq;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.bbq.BaseHttpConnection;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;

public class DownloadModule extends ReactContextBaseJavaModule {
  private static BaseHttpConnection baseHttpConnection = new BaseHttpConnection();
  public DownloadModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "DownloadImg";
  }

  @ReactMethod
  public void downloadImg(String url, String filename) {
    // private static BaseHttpConnection baseHttpConnection = new BaseHttpConnection();
        File file = new File(filename);
        // 检查文件是否存在,如不存在则会创建空文件
        if(!file.exists()){
            try{
                if(!file.createNewFile()){
                    // 文件创建失败,请检查目录是否正确以及权限
                    return;
                }
            }catch (IOException ioe){
                ioe.printStackTrace();
                return;
            }
        }
        BufferedOutputStream bufferedOutputStream = null;
        try{
            // 构造请求头
            HashMap<String, String> header = new HashMap<>();
            header.put("Referer", "http://localhost/");
            // 发送请求
            byte[] rawData = baseHttpConnection.getRawBytes(url, header);
            // 写入文件,这种写法会覆盖掉原有文件
            bufferedOutputStream = new BufferedOutputStream(new FileOutputStream(file));
            bufferedOutputStream.write(rawData);
            bufferedOutputStream.flush();
        }catch (IOException ioe){
            ioe.printStackTrace();
            return;
        }catch (Exception e){
            e.printStackTrace();
            return;
        }finally {
            try{
                if(bufferedOutputStream != null)
                    bufferedOutputStream.close();
            }catch (IOException ioe2){
            }
        }
        return;
    }
}