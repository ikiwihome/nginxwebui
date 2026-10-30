(function () {
    'use strict';
    var canvas = document.getElementById('loginLight');
    var grid = document.getElementById('loginGrid');
    if (!canvas || !grid) return;

    var gl = canvas.getContext('webgl', { alpha: false, powerPreference: 'low-power' });
    var context = grid.getContext('2d');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var program, resolution, ratio, time, buffer, frame, last = 0;
    var vertex = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}';
    var fragment = [
        'precision highp float;',
        'uniform vec2 resolution; uniform float ratio; uniform float time;',
        'float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453123);}',
        'float noise2(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);',
        'return mix(mix(rnd(i),rnd(i+vec2(1.,0.)),f.x),mix(rnd(i+vec2(0.,1.)),rnd(i+vec2(1.,1.)),f.x),f.y);}',
        'vec2 orbit(float t,float period){float a=t*6.28318530718/period; float r=.07*period/6.28318530718;',
        'return r*vec2(sin(a)+cos(a)-1.,sin(a)+1.-cos(a));}',
        'void main(){',
        'vec2 uv=(gl_FragCoord.xy/resolution-.5)*(.0035*resolution);',
        'float a=-5.0*3.14159265/180.0; uv=mat2(cos(a),sin(a),-sin(a),cos(a))*uv;',
        'uv=uv/ratio+vec2(.5,1.15);',
        'float n=noise2(uv+orbit(time,420.)); float n2=noise2(uv*2.-orbit(time,460.));',
        'uv+=.8*n2*vec2(cos(n*6.2831853),sin(n*6.2831853));',
        'float phase=time*6.2831853/90.;',
        'for(int j=1;j<=8;j++){float i=float(j);',
        'uv.x+=.24/i*(cos(phase)*cos(i*1.5*uv.y)-sin(phase)*sin(i*1.5*uv.y));',
        'uv.y+=.24/i*(cos(phase)*cos(i*uv.x)-sin(phase)*sin(i*uv.x));}',
        'float shape=.5+.5*sin(uv.x*.85)*cos(uv.y*.85);',
        'float blend=smoothstep(0.,.7,shape);',
        'vec3 color=mix(vec3(138.,163.,214.)/255.,vec3(1.),blend);',
        'gl_FragColor=vec4(color,1.);}'
    ].join('\n');

    function compile(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.warn('Login background shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    if (gl) {
        var vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
        if (vs && fs) {
            program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.useProgram(program);
                buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
                var position = gl.getAttribLocation(program, 'position');
                gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
                resolution = gl.getUniformLocation(program, 'resolution');
                ratio = gl.getUniformLocation(program, 'ratio'); time = gl.getUniformLocation(program, 'time');
            } else { program = null; }
        }
    }
    function drawGrid(width, height) {
        if (!context) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2), spacing = 90;
        grid.width = Math.round(width*dpr); grid.height = Math.round(height*dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        var cols = Math.ceil(width/spacing), rows = Math.ceil(height/spacing);
        var x0 = (width-cols*spacing)/2, y0 = (height-rows*spacing)/2;
        context.lineWidth = .5; context.strokeStyle = 'rgba(60,100,160,.1)';
        context.beginPath();
        for (var y=0; y<=rows; y++) for (var x=0; x<cols; x++) {
            context.moveTo(x0+x*spacing+10,y0+y*spacing); context.lineTo(x0+(x+1)*spacing-10,y0+y*spacing);
        }
        for (var x=0; x<=cols; x++) for (var y=0; y<rows; y++) {
            context.moveTo(x0+x*spacing,y0+y*spacing+10); context.lineTo(x0+x*spacing,y0+(y+1)*spacing-10);
        }
        context.stroke(); context.fillStyle = 'rgba(60,100,160,.04)';
        for (var y=0; y<=rows; y++) for (var x=0; x<=cols; x++) {
            context.beginPath(); context.arc(x0+x*spacing,y0+y*spacing,1.8,0,Math.PI*2); context.fill();
        }
    }
    function resize() {
        var width=window.innerWidth, height=window.innerHeight, dpr=window.devicePixelRatio || 1;
        drawGrid(width,height);
        if (program) {
            var scale=Math.min(dpr,1.5);
            canvas.width=Math.round(width*scale); canvas.height=Math.round(height*scale);
            gl.viewport(0,0,canvas.width,canvas.height);
            gl.uniform2f(resolution,canvas.width,canvas.height); gl.uniform1f(ratio,dpr);
            draw(0);
        }
    }
    function draw(timestamp) {
        if (!program) return;
        gl.uniform1f(time,timestamp/1000); gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    function animate(timestamp) {
        if (document.hidden || reduceMotion.matches) { frame=0; return; }
        if (timestamp-last>=33) { draw(timestamp); last=timestamp; }
        frame=requestAnimationFrame(animate);
    }
    function updateMotion() {
        if (frame) cancelAnimationFrame(frame);
        frame=0;
        if (!document.hidden && !reduceMotion.matches && program) frame=requestAnimationFrame(animate);
        else draw(0);
    }
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', updateMotion);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', updateMotion);
    else if (reduceMotion.addListener) reduceMotion.addListener(updateMotion);
    resize(); updateMotion();
})();
