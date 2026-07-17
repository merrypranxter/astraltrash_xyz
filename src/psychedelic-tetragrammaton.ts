// @ts-nocheck
/* ============================================================
   THE LIVING TETRAGRAMMATON — engine
   assembled whole from the notebook:
   · Clifford double rotation (XY & ZW, shared theta)
   · WHOOP eversion (XW chained on top)
   · singularity-safe 4D→3D perspective projection
   · recursive sinusoidal space-fold
   · temporal quantization: stable → buffering → SNAP
   · volumetric shadow & highlight (Beer–Lambert + fBm ether)
   ============================================================ */
(window as any).TG = {
  simT: 3.0,          // opens on a stable CUBE slice
  mouseX: 80, mouseY: -45,
  whoop: 1.0, snap: 5.0, dens: 1.0,
  lattice: true, proj: 'rd',
  frozen: false, speed: 1.0, pressure: 0
};

export const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_whoop;    // eversion intensity (the WHOOP)
uniform float u_density;  // glow density
uniform float u_snap;     // conscious snapshot rate (Hz)

// ---- stochastic hash ------------------------------------------------
float hash(float n){ return fract(sin(n)*43758.5453123); }

// ---- 3D value noise + fBm (the ether) -------------------------------
float hash3D(vec3 p){
    p = fract(p*vec3(443.8975,397.2973,491.1871));
    p += dot(p.xyz, p.yzx + 19.19);
    return fract(p.x*p.y*p.z);
}
float vnoise(vec3 p){
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0-2.0*f);
    return mix(
      mix(mix(hash3D(i+vec3(0.,0.,0.)), hash3D(i+vec3(1.,0.,0.)), u.x),
          mix(hash3D(i+vec3(0.,1.,0.)), hash3D(i+vec3(1.,1.,0.)), u.x), u.y),
      mix(mix(hash3D(i+vec3(0.,0.,1.)), hash3D(i+vec3(1.,0.,1.)), u.x),
          mix(hash3D(i+vec3(0.,1.,1.)), hash3D(i+vec3(1.,1.,1.)), u.x), u.y), u.z);
}
float fBm(vec3 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<3;i++){ v += a*vnoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

// ---- Clifford displacement + WHOOP eversion -------------------------
// R_xw(phi) · [ R_xy(theta) · R_zw(theta) ]
vec4 rotateTetragrammaton(vec4 p, float theta, float phi){
    float c = cos(theta), s = sin(theta);
    vec4 q = vec4(p.x*c - p.y*s,  p.x*s + p.y*c,  p.z, p.w);      // XY
         q = vec4(q.x, q.y,  q.z*c - q.w*s,  q.z*s + q.w*c);      // ZW
    float c2 = cos(phi), s2 = sin(phi);
         q = vec4(q.x*c2 - q.w*s2, q.y, q.z, q.x*s2 + q.w*c2);    // XW whoop
    return q;
}

// ---- geometric eigenstates (SDFs) -----------------------------------
float sdBox(vec3 p, vec3 b){
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdRhombicDodecahedron(vec3 p, float r){
    p = abs(p);
    return (p.x + p.y + p.z - r)*0.57735027;
}

// ---- scene map ------------------------------------------------------
float map(vec3 p, out vec3 p_local, out float qw){
    // 1 · embed in R4 and dance: Clifford spin + bounded WHOOP oscillation
    float phi = (0.45 + 0.55*u_whoop)*sin(u_time*0.33);
    vec4 q = rotateTetragrammaton(vec4(p,0.0), u_time*0.22, phi);
    qw = q.w;

    // 2 · 4D→3D perspective projection, near-W clipped
    float p_w = 5.0;
    float den = max(p_w - q.w, 1.0);
    vec3 pp = q.xyz*(p_w/den);

    // 3 · recursive space-fold (self-consumption)
    pp += sin(pp.yzx*2.1 + u_time*0.7)*(0.06*u_whoop);
    p_local = pp;

    // 4 · temporal quantization — the snapshot engine
    float tS   = u_time*0.5;
    float tStp = floor(tS*u_snap);
    float ph   = fract(tS*u_snap);
    float buf  = smoothstep(0.75, 1.0, ph);             // buffering window
    float jit  = sin(u_time*180.0)*hash(tStp)*buf*0.15; // whirring jitter
    vec3 pj    = pp + vec3(jit, -jit, jit*0.5)*buf;

    float ds = length(pj) - 0.80;                       // sphere
    float db = sdBox(pj, vec3(0.62));                   // cube
    float dd = sdRhombicDodecahedron(pj, 0.95);         // rhombic dodecahedron

    int sc = int(mod(tStp, 3.0));
    int sn = int(mod(tStp + 1.0, 3.0));
    float dc = (sc==0) ? ds : ((sc==1) ? db : dd);
    float dn = (sn==0) ? ds : ((sn==1) ? db : dd);

    float bw = clamp(buf + (hash(u_time)-0.5)*0.25*buf, 0.0, 1.0);
    float d  = mix(dc, dn, bw);                         // SNAP at ph == 1
    return d*(den/p_w);   // Jacobian correction: uniform world-space shell
}

// ---- spectral palette driven by the entity's own coordinates --------
vec3 spectral(vec3 pl){
    vec3 c = vec3(
        sin(u_time*0.15 + pl.x*0.9)*0.45 + 0.35,
        cos(u_time*0.22 - pl.y*0.7)*0.35 + 0.45,
        sin(u_time*0.10 + pl.z*1.1)*0.25 + 0.75);
    float l = (c.r + c.g + c.b)*0.3333;
    return clamp(mix(vec3(l), c, 1.6), 0.0, 1.0);
}

void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*u_resolution.xy)/u_resolution.y;
    vec3 ro = vec3(0.0, 0.0, -9.5);
    vec3 rd = normalize(vec3(uv, 2.4));

    float mx = u_mouse.x*0.005, my = u_mouse.y*0.005;
    mat2 RX = mat2(cos(mx),-sin(mx),sin(mx),cos(mx));
    mat2 RY = mat2(cos(my),-sin(my),sin(my),cos(my));
    rd.xz *= RX; rd.yz *= RY;
    ro.xz *= RX; ro.yz *= RY;

    float t = 0.0, T = 1.0;                 // T = transmittance
    vec3 col = vec3(0.0);
    vec3 pl  = vec3(0.0);
    float qw = 0.0;

    float bufNow = smoothstep(0.75, 1.0, fract(u_time*0.5*u_snap));

    // 5 · volumetric march: rays pass THROUGH — shadow & highlight only
    for(int i=0;i<80;i++){
        vec3 p = ro + rd*t;
        float d = map(p, pl, qw);
        float ad = abs(d);
        // witness gates: the near field of the entity only
        float gate = (1.0 - smoothstep(3.8, 4.6, length(p)))
                   * (1.0 - smoothstep(1.5, 2.0, abs(qw)));
        if(ad < 0.22 && gate > 0.01){
            float hi  = fBm(pl*2.5 + u_time*0.4);
            // HIGHLIGHT — crisp boundary rim + frayed ether halo
            float rim  = 0.0014/(d*d + 0.003);
            float halo = 0.0008/(ad + 0.02);
            float em = (rim*(0.50 + 1.20*hi) + halo*(0.05 + 0.15*hi))
                     * gate * exp(-max(t - 3.5, 0.0)*0.08);
            em *= 1.0 + 0.6*bufNow*sin(u_time*240.0 + p.y*40.0); // buffering flicker
            col += spectral(pl)*em*T*0.22*u_density*(1.0 - t/13.0);
            // SHADOW — Beer–Lambert extinction hollows
            float sh = vnoise(pl*5.0 - u_time*0.2);
            float ab = smoothstep(0.35, 0.85, sh)*0.60;
            T *= exp(-ab*0.16*u_density);
        }
        t += max(ad*0.5, 0.028);              // soft step into the ether
        if(t > 13.0 || T < 0.01) break;
    }

    col *= 1.2 - dot(uv,uv)*0.55;             // vignette
    col *= vec3(0.78, 0.88, 1.18);            // ether tint
    col += exp(-3.2*dot(uv,uv))*vec3(0.030,0.020,0.068)*(0.7 + 0.3*sin(u_time*0.35));
    col = col/(1.0 + col);                    // soft tonemap
    col = pow(max(col, vec3(0.0)), vec3(0.9));
    fragColor = vec4(col, 1.0);
}`;

const VERT = `#version 300 es
void main(){
    vec2 v = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2));
    gl_Position = vec4(v*2.0 - 1.0, 0.0, 1.0);
}`;

export function initTetragrammatonGL(canvas: HTMLCanvasElement, fallback: HTMLElement) {
  
  let gl = null;
  try{
    gl = canvas.getContext('webgl2',{antialias:false,alpha:false,depth:false,stencil:false,powerPreference:'high-performance'});
  }catch(e){}
  if(!gl){
    fallback.style.display = 'flex';
    canvas.style.display = 'none';
    return;
  }
  // software rasterizers (SwiftShader/llvmpipe) get a lighter incarnation
  let renderer = '';
  try{
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if(ext) renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
  }catch(e){}
  const Q = new URLSearchParams(location.search);
  const STILL = Q.has('still');                       // render a few frames, then hold
  const T0 = parseFloat(Q.get('t') || 'NaN');
  if(!Number.isNaN(T0)) TG.simT = T0;
  const LITE = STILL ||
               /swiftshader|llvmpipe|software|basic render/i.test(renderer) ||
               Q.has('lite');
  let RUN_FRAG = FRAG;
  if(LITE){
    RUN_FRAG = RUN_FRAG
      .replace('for(int i=0;i<80;i++)','for(int i=0;i<36;i++)')
      .replace('for(int i=0;i<3;i++){ v += a*vnoise(p);','for(int i=0;i<2;i++){ v += a*vnoise(p);');
  }
  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
      console.error(gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if(!vs || !fs){
    fallback.style.display = 'flex';
    canvas.style.display = 'none';
    return;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
    console.error(gl.getProgramInfoLog(prog)); return;
  }
  gl.useProgram(prog);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const U = {};
  ['u_resolution','u_time','u_mouse','u_whoop','u_density','u_snap'].forEach(n => U[n] = gl.getUniformLocation(prog, n));

  const DPR = LITE ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
  let resScale = STILL ? 0.5 : (LITE ? 0.34 : 1.0);
  function resize(){
    const w = Math.max(1, Math.floor(canvas.clientWidth  * DPR * resScale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * DPR * resScale));
    if(canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  let last = performance.now();
  let emaMs = 16, frames = 0, stillFrames = 0;

  let animationId;
  function frame(now){
    const dt = Math.min((now - last)/1000, 0.05);
    last = now;
    if(!TG.frozen && !STILL) TG.simT += dt * TG.speed;

    // adaptive resolution keeps the dance smooth on weaker GPUs
    emaMs = emaMs*0.95 + (dt*1000)*0.05;
    if(++frames % 90 === 0 && !LITE){
      if(emaMs > 34 && resScale > 0.55){ resScale = Math.max(0.55, resScale - 0.15); resize(); }
      else if(emaMs < 17 && resScale < 1.0){ resScale = Math.min(1.0, resScale + 0.10); resize(); }
    }

    const effDens = TG.dens * (1.0 + 0.55*TG.pressure);
    gl.uniform2f(U.u_resolution, canvas.width, canvas.height);
    gl.uniform1f(U.u_time, TG.simT);
    gl.uniform2f(U.u_mouse, TG.mouseX, TG.mouseY);
    gl.uniform1f(U.u_whoop, TG.whoop);
    gl.uniform1f(U.u_density, effDens);
    gl.uniform1f(U.u_snap, TG.snap);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if(STILL && ++stillFrames >= 4) return;  // hold the final frame
    animationId = requestAnimationFrame(frame);
  }
  animationId = requestAnimationFrame(frame);

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationId);
  };
}


// the code panel shows the canonical program (the GPU may run a lighter twin)
