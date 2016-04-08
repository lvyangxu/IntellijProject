/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.Iterator;

/**
 *
 * @author anshifafeng
 */
public class SocketServer {
    
    // 缓冲区大小  
    private final int BufferSize = 1024;  
    // 超时时间，单位毫秒  
    private final int TimeOut = 3000;  
    
    public void start(Integer port) throws Exception{
    	Selector Selector1 = Selector.open();
    	ServerSocketChannel ServerSocketChannel1 = ServerSocketChannel.open();
    	ServerSocketChannel1.socket().bind(new InetSocketAddress(port));
    	// 设置为非阻塞模式  
    	ServerSocketChannel1.configureBlocking(false);
    	// 将选择器绑定到监听信道,只有非阻塞信道才可以注册选择器.并在注册过程中指出该信道可以进行Accept操作  
    	ServerSocketChannel1.register(Selector1, SelectionKey.OP_ACCEPT);
    	
        // 反复循环,等待IO  
        while (true) {  
            // 等待某信道就绪(或超时)  
            if (Selector1.select(TimeOut) == 0) {// 监听注册通道，当其中有注册的 IO  
                                                // 操作可以进行时，该函数返回，并将对应的  
                                                // SelectionKey 加入 selected-key  
                                                // set  
                continue;  
            }  
            // 取得迭代器.selectedKeys()中包含了每个准备好某一I/O操作的信道的SelectionKey  
            // Selected-key Iterator 代表了所有通过 select() 方法监测到可以进行 IO 操作的 channel  
            // ，这个集合可以通过 selectedKeys() 拿到  
            Iterator<SelectionKey> keyIter = Selector1.selectedKeys().iterator();  
            while (keyIter.hasNext()) {  
                SelectionKey key = keyIter.next();  
                try {  
                    if (key.isAcceptable()) {  
                        // 有客户端连接请求时  
                        accept(key);  
                    }  
                    if (key.isReadable()) {// 判断是否有数据发送过来  
                        // 从客户端读取数据  
                        read(key);  
                    }  
                    if (key.isValid() && key.isWritable()) {// 判断是否有效及可以发送给客户端  
                        // 客户端可写时  
                        write(key);  
                    }  
                } catch (Exception e) {  
                    // 出现IO异常（如客户端断开连接）时移除处理过的键  
                	System.out.println("连接出现异常:"+e.getMessage());
                    keyIter.remove();  
                    continue;  
                }  
                // 移除处理过的键  
                keyIter.remove();  
            }  
        }  
    }
    
    private void accept(SelectionKey key) throws Exception{
    	System.out.println("有新的客户端连入:"+key.toString());
        // 返回创建此键的通道，接受客户端建立连接的请求，并返回 SocketChannel 对象  
        SocketChannel clientChannel = ((ServerSocketChannel) key.channel())  
                .accept();  
        // 非阻塞式  
        clientChannel.configureBlocking(false);  
        // 注册到selector  
        clientChannel.register(key.selector(), SelectionKey.OP_READ,ByteBuffer.allocate(BufferSize));      	
    }
    
    private void read(SelectionKey key) throws Exception{
        // 获得与客户端通信的信道  
        SocketChannel clientChannel = (SocketChannel) key.channel();  
        // 得到并清空缓冲区  
        ByteBuffer buffer = (ByteBuffer) key.attachment();  
        buffer.clear();  
        // 读取信息获得读取的字节数  
        long bytesRead = clientChannel.read(buffer);  
        if (bytesRead == -1) {  
            // 没有读取到内容的情况  
            clientChannel.close();  
        } else {  
            // 将缓冲区准备为数据传出状态  
            buffer.flip();  
            // 将字节转化为为UTF-16的字符串  
            String receivedString = Charset.forName("UTF-8").newDecoder()  
                    .decode(buffer).toString();  
            // 控制台打印出来  
            System.out.println("接收到来自"  
                    + clientChannel.socket().getRemoteSocketAddress() + "的信息:"  
                    + receivedString);  
            // 准备发送的文本  
            String sendString = "你好,客户端. @" + new Date().toString()  
                    + "，已经收到你的信息" + receivedString;  
            buffer = ByteBuffer.wrap(sendString.getBytes("UTF-8"));  
            clientChannel.write(buffer);  
            // 设置为下一次读取或是写入做准备  
            key.interestOps(SelectionKey.OP_READ | SelectionKey.OP_WRITE);  
        }      	
    }
    
    private void write(SelectionKey key) throws Exception{
    	
    }
}

