var socket, canvas, ctx;
var brush = {
    x: 0,
    y: 0,
    color: '#000000',
    size: 5,
    down: false,
  },
  strokes = [],
  currentStroke = null;

function paint () {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineCap = 'round';
    for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (var j = 0; j < s.points.length; j++) {
            var p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function init () {
    canvas = $('#rough');
    
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    ctx = canvas[0].getContext('2d');

    socket = io.connect("http://localhost:200");
    
    function mouseEvent (e) {  
       brush.x = e.pageX;
       brush.y = e.pageY;
       currentStroke.points.push({
          x: brush.x,
          y: brush.y,
       });

       data = {
          color: brush.color,
          size: brush.size, 
          x: brush.x,
          y: brush.y
       }
       
       socket.emit("mouse", data);

       paint();
    }

    socket.on("painter", (data) => {
        currentStroke = {
            color: data.color,
            size: data.size,
            points: []
        };
        strokes.push(currentStroke);
        currentStroke.points.push({
            x: data.x,
            y: data.y,
        });
      
        paint();
    });

    canvas.mousedown(function (e) {
        brush.down = true;
        currentStroke = {
            color: brush.color,
            size: brush.size,
            points: [],
        };
        strokes.push(currentStroke);
        mouseEvent(e);
    }).mouseup(function (e) {
        brush.down = false;
        mouseEvent(e);
        currentStroke = null;
    }).mousemove(function (e) {
        if (brush.down) mouseEvent(e);
    });

    $('#undo').click(function () {
        strokes.pop();
        paint();
    });

    $('#clear').click(function () {
        strokes = [];
        paint();
    });

    $('#color').on('input', function () {
        brush.color = this.value;
    });
  
    $('#brush').on('input', function () {
        brush.size = this.value;
    });
}

$(init);