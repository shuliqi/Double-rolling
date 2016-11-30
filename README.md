# Double-rolling
##模拟滚动条解决移动页面双浮层背景层滑动的问题
#Demo:
 下载scroll.html。
#问题再现：
 在做一个评论组件的时候，有双浮层的出现，且两个浮层的都是可以滚动的。高度根据内容而定，现在需求是这样的，上面那一层的浮层在滑动的时候，需要后面的浮测试保持不动的（可现实是都会发生浮动）。
#解决办法：
##1.使用绝对定位：position：fixed;
    这种办法是在上面那一层的浮动的时候，后面的浮层position：fixed;
    但是给了绝对定位之后，无论之前背景浮层滚动到什么位置,都会定位到顶部，不符合需求
##2.给body,html加：overflow：hidden;
     这种办法只有在pc端有效，在移动端就无效了，原因是PC端是基于鼠标滚动的，而移动端是基于touch事件的。所以就无效了
#根本的解决办法
   模拟滚动条：对于浮层则通过捕获touchstart、touchmove、touchend事件来计算手指滑动的距离，使得浮层进行移动。
#核心实现代码：
```javascript
/*调用说明：noScroll.init('j_s_float',$('.j_s_float'),$('.j_ns_float'));
 *@param{
 *  j_s_float:浮层的class的名字
 *  $('.j_s_float'):浮层
 *  $('.j_ns_float'):背景层 }
 */
var noScroll = {  
        y: 0 ,//手指走过的距离
        disY:0,//记录每次touchmove时的初始距离
        scrollTop:0,
        startBool:false,
        init:function(s_float,scroll_float,noscroll_float){
            var self = this; 
            self.touchstart(s_float,scroll_float);            
            noscroll_float.on("touchmove",function(e){//禁止背景层的滚动
                e.preventDefault();
                e.stopPropagation();          
            });
        },
        touchstart:function(s_float,scroll_float){
            var self = this;                                
            if(!self.startBool){
             //保证在一次touchstart未结束时，不能开启第二次start，也就是解决两个手指以上会乱跳的问题
                scroll_float.bind("touchstart",function(e){
                    self.y = 0;//手指划过的距离清空
                    self.startBool = true;
                    self.scrollTop = scroll_float[0].scrollTop
                    self.disY =e.changedTouches[0].pageY;                    
                    self.touchmove(s_float,scroll_float);
                    self.touchend(s_float,scroll_float);

                });
            }
        },
        touchmove:function(s_float,scroll_float){
            var  self = this;
            scroll_float.bind("touchmove",function(e){
                e.preventDefault();
                e.stopPropagation(); 
                self.y += e.changedTouches[0].pageY - self.disY;    
                if(scroll_float.height()+scroll_float.get(0).scrollTop>=scroll_float.get(0).scrollHeight&&self.y<0) {
                    //滑到底部
                    self.y = 0;
                    return;

                }else if(scroll_float.get(0).scrollTop === 0&&self.y>0){
                    //滑到顶部
                    self.y = 0;
                    return ;
                }else{
                    self.v0 = (e.changedTouches[0].pageY - self.disY)/5;

                    scroll_float[0].scrollTop=self.scrollTop-self.y ;   

                    self.disY = e.changedTouches[0].pageY; 
                }                                
            });
        },
        touchend:function(s_float,scroll_float){

            scroll_float.bind('touchend', function(e) {
                scroll_float.unbind('touchmove');
                scroll_float.unbind('touchend');
            }); 

        }        
    }
```
