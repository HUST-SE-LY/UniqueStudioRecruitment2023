import { Message } from "./Message";

export const drawFireWork = (canvas: HTMLCanvasElement, deleted?: boolean) => {
  if(deleted) {
    document.body.removeChild(canvas);
    return;
  }
  Message.success("祝你今日愉快！再按一次关闭彩蛋:)");
  const rnd = Math.random;

  document.getElementsByTagName("body")[0].appendChild(canvas);
  canvas.style.background = "transparent";
  canvas.style.position = "fixed";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const ctx = canvas.getContext("2d");

  function rndNum(num) {
    return rnd() * num + 1;
  }

  function vector(x, y) {
    this.x = x;
    this.y = y;

    this.add = function (vec2) {
      this.x = this.x + vec2.x;
      this.y = this.y + vec2.y;
    };
  }

  function particle(pos, vel) {
    this.pos = new vector(pos.x, pos.y);
    this.vel = vel;
    this.dead = false;
    this.start = 0;

    this.update = function (time) {
      const timeSpan = time - this.start;

      if (timeSpan > 500) {
        this.dead = true;
      }

      if (!this.dead) {
        this.pos.add(this.vel);
        this.vel.y = this.vel.y + gravity;
      }
    };

    this.draw = function () {
      if (!this.dead) {
        drawDot(this.pos.x, this.pos.y, 1);
      }
    };
  }

  function firework(x, y) {
    this.pos = new vector(x, y);
    this.vel = new vector(0, -rndNum(10) - 3);
    this.color = "hsl(" + rndNum(360) + ", 100%, 50%)";
    this.size = 4;
    this.dead = false;
    this.start = 0;
    const exParticles = [],
      exPLen = 100;

    let rootShow = true;

    this.update = function (time) {
      if (this.dead) {
        return;
      }

      rootShow = this.vel.y < 0;

      if (rootShow) {
        this.pos.add(this.vel);
        this.vel.y = this.vel.y + gravity;
      } else {
        if (exParticles.length === 0) {
          flash = true;
          for (let i = 0; i < exPLen; i++) {
            exParticles.push(
              new particle(
                this.pos,
                new vector(-rndNum(10) + 5, -rndNum(10) + 5)
              )
            );
            exParticles[exParticles.length - 1].start = time;
          }
        }
        let numOfDead = 0;
        for (let i = 0; i < exPLen; i++) {
          const p = exParticles[i];
          p.update(time);
          if (p.dead) {
            numOfDead++;
          }
        }

        if (numOfDead === exPLen) {
          this.dead = true;
        }
      }
    };

    this.draw = function () {
      if (this.dead) {
        return;
      }

      ctx.fillStyle = this.color;
      if (rootShow) {
        drawDot(this.pos.x, this.pos.y, this.size);
      } else {
        for (let i = 0; i < exPLen; i++) {
          const p = exParticles[i];
          p.draw();
        }
      }
    };
  }

  function drawDot(x, y, size) {
    ctx.beginPath();

    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.closePath();
  }

  const fireworks = [];
  const gravity = 0.2;
  let flash = false;

  function init() {
    const numOfFireworks = 20;
    for (let i = 0; i < numOfFireworks; i++) {
      fireworks.push(new firework(rndNum(canvas.width), canvas.height));
    }
  }

  function update(time) {
    for (let i = 0, len = fireworks.length; i < len; i++) {
      const p = fireworks[i];
      p.update(time);
    }
  }

  function draw(time?) {
    update(time);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0)";
    if (flash) {
      flash = false;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    //ctx.fillText(newTime,10,50);

    ctx.fillStyle = "blue";
    for (let i = 0, len = fireworks.length; i < len; i++) {
      let p = fireworks[i];
      if (p.dead) {
        fireworks[i] = new firework(rndNum(canvas.width), canvas.height);
        p = fireworks[i];
        p.start = time;
      }
      p.draw();
    }

    window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  });

  init();
  draw();
};
