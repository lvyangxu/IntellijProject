package MyLibrary;

import java.lang.reflect.Method;

public class Delegate {
	public void test(String a) {
        System.out.println(a);
	}
	
	public void invoke(Method Method1,Object args) throws Exception{
		Method1.invoke(Method1.getClass(), args);
	}
	
	public interface delegateInter{
		public abstract void test1();
	}

}
