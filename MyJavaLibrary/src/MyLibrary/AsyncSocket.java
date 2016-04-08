/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyLibrary;

import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONObject;

/**
 *
 * @author anshifafeng
 */
public class AsyncSocket {

    public Object[] startServet() {
        Object[] result = new Object[]{null, null};
        Selector selector = null;
        try {
            //异步IO的核心对象名selector 具有事件侦听的效果
            //selector就是您注册对各种io事件的兴趣的地方 而且当那些事件发生时 就是这个对象告诉您所发生的事情
            selector = Selector.open();
            //打开一个serversocketchannel通道
            ServerSocketChannel ssc = ServerSocketChannel.open();
            //设为异步
            ssc.configureBlocking(false);
            //绑定端口
            ServerSocket ss = ssc.socket();
            InetSocketAddress address = new InetSocketAddress(8888);
            ss.bind(address);
            //注册事件 regisiter的第一个参数总是selector 第二个总是op_accept 这里他指定我们要监听accept事件
            //也就是当有新的链接进来是发生的事件
            ssc.register(selector, SelectionKey.OP_ACCEPT);
            System.out.println("端口注册完成");
            result[0] = selector;
        } catch (Exception e) {
            result[1] = e.getMessage();
        }
        return result;
    }

    public void doSocketMessage(Selector selector) {
        while (true) {

            Iterator<SelectionKey> iter = null;
            try {
                //select()这个方法会阻塞 直到有一个已注册的事件发生 当一个或者更多的事件注册进来的时候 这个会返回事件的数量
                selector.select();
                System.out.println("长度:" + selector.keys().size());
                //调用selectedKeys()会返回事件对象集合
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                //然后我们迭代处理每一个事件
                iter = selectionKeys.iterator();
            } catch (Exception e) {
                System.out.println("操作selector时发生异常:" + e.getMessage());
            }

            ByteBuffer echoBuffer = ByteBuffer.allocate(2048);
            String leaveMessage = "";

            SocketChannel sc;
            while (iter.hasNext()) {
                SelectionKey key = iter.next();
                //判断事件类型
                if ((key.readyOps() & SelectionKey.OP_ACCEPT) == SelectionKey.OP_ACCEPT) {
                    ServerSocketChannel nssc = (ServerSocketChannel) key.channel();
                    try {
                        sc = nssc.accept();
                        //设为非阻塞
                        sc.configureBlocking(false);
                        sc.register(selector, SelectionKey.OP_READ);
                        iter.remove();
                        System.out.println("有新的链接" + sc);
                    } catch (Exception e) {
                    }

                } else if ((key.readyOps() & SelectionKey.OP_READ) == SelectionKey.OP_READ) {
                    sc = (SocketChannel) key.channel();

                    while (true) {

                        echoBuffer.clear();
                        int a = 0;
                        try {
                            a = sc.read(echoBuffer);
                        } catch (Exception e) {
                            System.out.println("处理消息时发生异常:" + e.getMessage());
                            break;
                        }
                        if (a == -1) {
                            break;
                        }
                        if (a > 0) {
                            byte[] b = echoBuffer.array();
                            String message = new String(b);

                            leaveMessage = leaveMessage + message.trim();
                            Pattern Pattern1 = Pattern.compile("\\{[^{}]*\\}");
                            Matcher Matcher1 = Pattern1.matcher(leaveMessage);
                            //消息未发送完成
                            if (!Matcher1.find()) {
                                System.out.println("消息未发送完成");
                            } //有完整的一条消息
                            else {
                                String decodeMessage = getMessageFromMyJson(Matcher1.group());
                                if (Matcher1.group().length() <= leaveMessage.length() - 1) {
                                    leaveMessage = leaveMessage.substring(Matcher1.group().length(), leaveMessage.length() - 1);
                                }
                                System.out.println("接收数据: " + decodeMessage);
                                echoBuffer.flip();
                                try {
                                    sc.write(echoBuffer);
                                } catch (Exception e) {
                                    System.out.println("回复数据失败: " + e.getMessage());
                                }

                                System.out.println("返回数据: " + decodeMessage);

                            }

                        }
                    }
                    try {
                        sc.close();
                    } catch (Exception e) {
                        System.out.println("socketchannel关闭失败: " + e.getMessage());
                    }

                    System.out.println("连接结束");
                    iter.remove();
                }
            }

        }
    }

    DoDataTranslation DoCode1 = new DoDataTranslation();

    private String getMessageFromMyJson(String message) {
        String result = null;
        try {
            JSONObject JSONObject1 = new JSONObject(message);
            result = JSONObject1.get("message").toString();
            result = Str.decode(result, "base64");
        } catch (Exception e) {
        }
        return result;
    }
}
