noScroll = {
        y: 0 ,//手指走过的距离
        disY:0,//记录每次触touchmove时的初始距离
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
            if(!self.startBool){//保证在一次touchstart未结束时，不能开启第二次start，也就是解决两个手指以上会乱跳的问题
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
            _this.noScroll. startBool = false;

        }        