package MyLibrary;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DoDate {
	
	SimpleDateFormat SimpleDateFormat1 = new SimpleDateFormat("yyyy-MM-dd");

	public String toMonday(String dateStr) throws Exception {
		Date Date1 = SimpleDateFormat1.parse(dateStr);
		Calendar Calender1 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		int index = Calender1.getFirstDayOfWeek();
		int add = 0;
		if(index==0){
			add = -6;
		}else{
			add = 1-index;
		}
		Calender1.add(Calendar.DAY_OF_MONTH, add);
		String result = SimpleDateFormat1.format(Calender1.getTime());
		return result;
	}
	
	public String toSunday(String dateStr) throws Exception {
		Date Date1 = SimpleDateFormat1.parse(dateStr);
		Calendar Calender1 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		int index = Calender1.getFirstDayOfWeek();
		int add = 0;
		if(index!=0){
			add = 6 -index;
		}
		Calender1.add(Calendar.DAY_OF_MONTH, add);
		String result = SimpleDateFormat1.format(Calender1.getTime());
		return result;
	}	
	
	public String toMonthFirst(String dateStr) throws Exception{
		Date Date1 = SimpleDateFormat1.parse(dateStr);
		Calendar Calender1 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		Calender1.set(Calendar.DAY_OF_MONTH,1);
		String result = SimpleDateFormat1.format(Calender1.getTime());
		return result;		
	}
	
	public String getToday(){		
		Calendar Calender1 = Calendar.getInstance(); 
		String result = SimpleDateFormat1.format(Calender1.getTime());
		return result;		
	}
	

	public List<String> getAreaWeekToMonday(String starttime,String endtime) throws Exception{
		List<String> result = new ArrayList<>();
		String start = toMonday(starttime);
		String end = toMonday(endtime);
		Date Date1 = SimpleDateFormat1.parse(start);
		Date Date2 = SimpleDateFormat1.parse(end);
		Calendar Calender1 = Calendar.getInstance(); 
		Calendar Calender2 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		Calender2.setTime(Date2);
		while(!Calender1.after(Calender2)){
			String day = SimpleDateFormat1.format(Calender1.getTime());
			result.add(day);
			//增加7天
			Calender1.add(Calendar.DAY_OF_MONTH,7);
		}		
		return result;
	}
	
	public List<String> getAreaMonthToFirst(String starttime,String endtime) throws Exception{
		List<String> result = new ArrayList<>();
		Date Date1 = SimpleDateFormat1.parse(starttime+"-01");
		Date Date2 = SimpleDateFormat1.parse(endtime+"-01");
		Calendar Calender1 = Calendar.getInstance(); 
		Calendar Calender2 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		Calender2.setTime(Date2);
		while(!Calender1.after(Calender2)){
			String day = SimpleDateFormat1.format(Calender1.getTime());
			result.add(day);
			//增加1月
			Calender1.add(Calendar.MONTH,1);
		}		
		return result;
	}	

	public List<String> getAreaDay(String starttime,String endtime) throws Exception{
		List<String> result = new ArrayList<>();
		Date Date1 = SimpleDateFormat1.parse(starttime);
		Date Date2 = SimpleDateFormat1.parse(endtime);
		Calendar Calender1 = Calendar.getInstance(); 
		Calendar Calender2 = Calendar.getInstance(); 
		Calender1.setTime(Date1);
		Calender2.setTime(Date2);
		while(!Calender1.after(Calender2)){
			String day = SimpleDateFormat1.format(Calender1.getTime());
			result.add(day);
			//增加7天
			Calender1.add(Calendar.DAY_OF_MONTH,1);
		}		
		return result;
	}	
}
