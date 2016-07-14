import Models.MyException;
import Util.Http;

/**
 * Created by karl on 2016/7/13.
 */
public class Main {
    public static void main(String args[]) {
        //http request
        try {
//            String result = Http.get("http://www.baidu.com");
            String result = Http.get("http://ipblock.chacuo.net/down/t_txt=c_US");
            System.out.print(result);
        } catch (MyException e) {
            e.printStackTrace();
        }

    }
}
