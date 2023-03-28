////Alex Olhovskiy////

var mycanvas=document.getElementById('mycanvas');
mycanvas.height=150;
mycanvas.width=mycanvas.height*5;

var ctx=mycanvas.getContext('2d');

function MyPoint(x,y)
{
	this.x=x;
	this.y=y;
}

function MyLine(p1,p2)
{
	this.ax=p2.x-p1.x;
	this.ay=p2.y-p1.y;
	this.p1=new MyPoint(p1.x,p1.y);
	this.p2=new MyPoint(p2.x,p2.y);
}

function LinesIntercepter(l1,l2)
{
	var a=l2.ay*l1.ay*(l2.p1.x-l1.p1.x);
	var b=l2.ax*l1.ay*l2.p1.y;
	var c=l2.ay*l1.ax*l1.p1.y;
	var d=l2.ay*l1.ax-l2.ax*l1.ay;
	var y=(a-b+c)/d;
	var x=(l1.ax*y-l1.ax*l1.p1.y+l1.ay*l1.p1.x)/l1.ay;
	return new MyPoint(x,y);
}

function IsInAria()
{
	
}


function MyParabolaMap()
{
	this.w=mycanvas.width;
	this.basicPointsArr=new Array();
	this.arr=new Array();
	for(var i=0;i<(mycanvas.width*mycanvas.height);i++)
	{
		this.arr.push(false);
	}
	
	
	this.BasicPointsForm=function()
	{
		var temp=10;
		var step=mycanvas.width/temp;
		var borderh=mycanvas.height/4;
		var y=0;
		for(var i=0;i<(temp+1);i++)
		{
			y=2*borderh+Math.random()*borderh;//(mycanvas.height-2*borderh);
			this.basicPointsArr.push(new MyPoint(i*step,y));
		}			
	}
	this.BasicPointsForm();
	
	this.arrForm=function()
	{
		var temp,my;
		for(var i=0;i<(this.basicPointsArr.length-1);i++)
		{
			temp=new MyLine(this.basicPointsArr[i],this.basicPointsArr[i+1]);
			for(var j=temp.p1.x;j<temp.p2.x;j++)
			{
				my=Math.round((temp.ay*j-temp.ay*temp.p1.x+temp.ax*temp.p1.y)/temp.ax);
				for(var h=(mycanvas.height-1);h>my;h--)
				{
					this.arr[h*this.w+j]=true;
				}
				
			}
		}
		console.log(this.arr.length);
	}
	
	this.arrForm();
	
	this.ArrModificator=function(x,y,r)
	{
		var n=(y-r)*mycanvas.width+(x-r);
		for(var j=n;j<(n+2*r*mycanvas.width);j+=mycanvas.width)
		{
			for(var i=j;i<(j+r*2);i++)
			{
				if(mypmap.arr[i])
				{
					if(Math.sqrt(Math.pow((i%mycanvas.width-x),2)+
					Math.pow((i/mycanvas.width-y),2))<r)
					{
						mypmap.arr[i]=false;
					}
				}
			}
		}
	}
	
	this.Drow=function()
	{
		ctx.fillStyle='rgb(255,10,25)';
		
		
		for(var i=0;i<this.arr.length;i++)
		{
			if(this.arr[i])
			{
				ctx.fillRect(i%this.w,i/this.w,1,1);
			}

		}
		
		for(var i=0;i<mycanvas.width;i+=50)
		{
			ctx.strokeStyle='rgb(0,0,0)';
			ctx.beginPath();
			ctx.moveTo(i,mycanvas.height);
			if(i%100)
			{
				ctx.lineTo(i,mycanvas.height-10);
			}
			else
			{
				ctx.lineTo(i,mycanvas.height-20);
			}
			ctx.closePath();
			ctx.stroke();
		}
		
		ctx.fillStyle='rgb(0,0,0)';
		ctx.fillText("5 km",50,mycanvas.height-15);
		
	}
}



function MyBoom(x,y)
{
	this.p=new MyPoint(x,y);
	this.parts=15;
	this.step=-Math.PI/(this.parts+2);
	this.ang=this.step;
	this.times=10;
	this.t=0;
	this.flag=false;
	this.arr=new Array();
	
	this.SetUp=function()
	{
		for(var i=0;i<this.parts;i++)
		{
			if(i%2)//long
			{
				this.arr.push(new MyPoint(this.ang,12+Math.random()*20));
			}
			else//short
			{
				this.arr.push(new MyPoint(this.ang,6+Math.random()*10));
			}
			this.ang+=this.step;
		}
	}
	this.SetUp();
	
	this.Move=function()
	{
		if(this.t<this.times)
		{
			for(var i=0;i<this.arr.length;i++)
			{
				this.arr[i].y++;//=3;
			}
			this.t++;
		}
		else
		{
			this.flag=true;
		}
	}
	
	this.Drow=function()
	{
		ctx.fillStyle="rgb(255,50,50)";
		ctx.beginPath();
		ctx.moveTo(this.p.x,this.p.y);
		for(var i=0;i<this.arr.length;i++)
		{
			ctx.lineTo(this.p.x+Math.cos(this.arr[i].x)*this.arr[i].y,
			this.p.y+Math.sin(this.arr[i].x)*this.arr[i].y);
		}
		ctx.closePath();
		ctx.fill();
	}
}


function MyShell(x,y,a,v,r)
{
	this.p=new MyPoint(x,y);
	this.v=v;
	this.g=0.1;
	this.t=0;
	this.ang=a;
	this.r=r;
	this.arr=new Array();
	this.flag=false;
	
	this.Move=function()
	{
		this.t++;
		this.arr.push(new MyPoint(Math.round(this.p.x+Math.cos(this.ang)*this.v*this.t),
		Math.round(this.p.y+Math.sin(this.ang)*this.v*this.t+this.g*this.t*this.t/2)));
			
		if(mypmap.arr[this.arr[this.arr.length-1].y*mycanvas.width+this.arr[this.arr.length-1].x])
		{
			this.t=0;
			this.flag=true;
			boomArr.push(new MyBoom(this.arr[this.arr.length-1].x,this.arr[this.arr.length-1].y));
			mypmap.ArrModificator(this.arr[this.arr.length-1].x,this.arr[this.arr.length-1].y,this.r);
			this.arr.splice(0);
		}
	}
	
	this.Drow=function()
	{
		ctx.strokeStyle="rgb(255,0,255)";
		for(var i=0;i<this.arr.length;i++)
		{
			ctx.fillRect(this.arr[i].x,this.arr[i].y,1,1);
		}
	}
}

function MyParabolaTanc(x)
{
	this.SetOnMap=function(x)
	{
		for(var i=x;i<mypmap.arr.length;i+=mycanvas.width)
		{
			if(mypmap.arr[i])
			{
				return i/mycanvas.width;
			}
		}
		return 1;
	}
	
	this.arr=new Array();
	
	this.R=15;
	this.r=5;
	this.ang=-Math.PI/2;
	this.ang2=-Math.PI/2;
	this.mstep=5;
	this.astep=0.1;
	this.astep2=0.1;
	this.v=8;
	this.rr=5;
	this.flag=false;
	
	
	this.arr.push(new MyPoint(x,this.SetOnMap(x)));
	this.arr.push(new MyPoint(this.arr[0].x+Math.cos(-Math.PI-this.ang2)*this.r,
		this.arr[0].y+Math.sin(-Math.PI-this.ang2)*this.r));
	this.arr.push(new MyPoint(this.arr[0].x+Math.cos(this.ang2)*this.r,
		this.arr[0].y+Math.sin(this.ang2)*this.r));
	this.arr.push(new MyPoint(this.arr[0].x+Math.cos(this.ang)*this.R,
		this.arr[0].y+Math.sin(this.ang)*this.R));
	
	this.condition=false;
	this.mobility=true;
	this.isShoot=false;
	
	this.TancSetUp=function()
	{
		this.arr[1].x=this.arr[0].x+Math.cos(-Math.PI-this.ang2)*this.r;
		this.arr[1].y=this.arr[0].y+Math.sin(-Math.PI-this.ang2)*this.r;
		this.arr[2].x=this.arr[0].x+Math.cos(this.ang2)*this.r;
		this.arr[2].y=this.arr[0].y+Math.sin(this.ang2)*this.r;
		this.arr[3].x=this.arr[0].x+Math.cos(this.ang)*this.R;
		this.arr[3].y=this.arr[0].y+Math.sin(this.ang)*this.R;
	}
	
	this.Preparation=function()
	{
		if(this.condition)
		{
			if((this.ang2+this.astep2)<0)
			{
				this.ang2+=this.astep2;
			}
			else
			{
				this.ang2=0;
				this.mobility=false;
				
			}
			this.arr[2].x=this.arr[0].x+Math.cos(this.ang2)*this.r;
			this.arr[2].y=this.arr[0].y+Math.sin(this.ang2)*this.r;
				
			this.arr[1].x=this.arr[0].x+Math.cos(-Math.PI-this.ang2)*this.r;
			this.arr[1].y=this.arr[0].y+Math.sin(-Math.PI-this.ang2)*this.r;
		}
		else
		{
			if((this.ang2-this.astep2)>(-Math.PI/2))
			{
				this.ang2-=this.astep2;
			}
			else
			{
				this.ang2=(-Math.PI/2);
				this.mobility=true;
			}
			this.arr[2].x=this.arr[0].x+Math.cos(this.ang2)*this.r;
			this.arr[2].y=this.arr[0].y+Math.sin(this.ang2)*this.r;
				
			this.arr[1].x=this.arr[0].x+Math.cos(-Math.PI-this.ang2)*this.r;
			this.arr[1].y=this.arr[0].y+Math.sin(-Math.PI-this.ang2)*this.r;
		}
	}
	
	
	this.BMove=function(b)
	{
		if(!this.mobility)
		{
			if(b)
			{
				if((this.ang+this.astep)<=0)
				{
					this.ang+=this.astep;
				}
				else
				{
					this.ang=0;
				}
			}
			else
			{
				if((this.ang-this.astep)>(-Math.PI))
				{
					this.ang-=this.astep;
				}
				else
				{
					this.ang=-Math.PI;
				}
			}
		}
		this.arr[3].x=this.arr[0].x+Math.cos(this.ang)*this.R;
		this.arr[3].y=this.arr[0].y+Math.sin(this.ang)*this.R;
	}
	
	this.Move=function(b)
	{
		if(this.mobility)
		{
			if(b)
			{
				if((this.arr[0].x-this.mstep)>0)
				{
					this.arr[0].x-=this.mstep;
				}
				else
				{
					this.arr[0].x=0;
				}
			}
			else
			{
				if((this.arr[0].x+this.mstep)<mycanvas.width)
				{
					this.arr[0].x+=this.mstep;
				}
				else
				{
					this.arr[0].x=mycanvas.width;
				}
			}
			this.arr[0].y=this.SetOnMap(this.arr[0].x);
			this.TancSetUp();
		}
		
	}
	
	this.Shoot=function()
	{
		shellArr.push(new MyShell(this.arr[0].x,this.arr[0].y,this.ang,this.v,this.rr));
	}
	
	this.Drow=function()
	{
		ctx.strokeStyle="rgb(0,0,255)";
		
		ctx.beginPath();
		ctx.moveTo(this.arr[0].x,this.arr[0].y);
		ctx.lineTo(this.arr[1].x,this.arr[1].y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(this.arr[0].x,this.arr[0].y);
		ctx.lineTo(this.arr[2].x,this.arr[2].y);
		ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(this.arr[0].x,this.arr[0].y);
		ctx.lineTo(this.arr[3].x,this.arr[3].y);
		ctx.closePath();
		ctx.stroke();
	}
}


function MyEnemy(x)
{
	MyParabolaTanc.apply(this,arguments);
	
}



var mypmap=new MyParabolaMap();

var myt=new MyParabolaTanc(100);
var shellArr=new Array();
var boomArr=new Array();
var enemyArr=new Array();

enemyArr.push(new MyEnemy(500));
enemyArr.push(new MyEnemy(600));


function TotalCommFunc()
{
	ctx.fillStyle='rgb(0,255,0)';
	ctx.fillRect(0,0,mycanvas.width,mycanvas.height);
	mypmap.Drow();
	//myt.Move();
	
	
	if(shellArr.length)
	{
		for(var i=0;i<shellArr.length;i++)
		{
			if(!shellArr[i].flag)
			{
				shellArr[i].Move();
				shellArr[i].Drow();
			}
		}
	}
	
	if(boomArr.length)
	{
		for(var i=0;i<boomArr.length;i++)
		{
			if(!boomArr[i].flag)
			{
				boomArr[i].Move();
				boomArr[i].Drow();
			}
		}
	}
	
	if(enemyArr.length)
	{
		for(var i=0;i<enemyArr.length;i++)
		{
			if(!enemyArr[i].flag)
			{
				//enemyArr[i].Move();
				enemyArr[i].Drow();
			}
		}
	}
	
	myt.Preparation();
	myt.Drow();
	
	//console.log(1);
}

TotalCommFunc();

setInterval(TotalCommFunc,1000);

addEventListener('keydown',function(e){
	console.log(e.keyCode);
	switch(e.keyCode)
	{
		case 87:myt.BMove(true);break;//w
		case 83:myt.BMove(false);break;//s
		case 32:myt.Shoot();break;//space
		case 65:myt.Move(true);break;//a
		case 68:myt.Move(false);break;//d
		case 90:myt.condition^=1;console.log(myt.condition);break;//z
		
	}
});