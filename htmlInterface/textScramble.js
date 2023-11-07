// Credit 
// https://codepen.io/htmler/pen/LjgqeK
// https://gist.github.com/hackistic/79dca7dca0323130dbc7f8e50654db98#file-script-js
class TextScramble {
    constructor(el) {
      this.el = el
      this.chars = '!<>-_\\/[]{}—=+*^?#________'
      this.update = this.update.bind(this)
    }
    setText(newText) {
      const oldText = this.el.innerText
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => this.resolve = resolve)
      this.queue = []
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 40)
        const end = start + Math.floor(Math.random() * 40)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }
    update() {
      let output = ''
      let complete = 0
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i]
        if (this.frame >= end) {
          complete++
          output += to
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar()
            this.queue[i].char = char
          }
          output += `<span class="dud">${char}</span>`
        } else {
          output += from
        }
      }
      this.el.innerHTML = output
      if (complete === this.queue.length) {
        this.resolve()
      } else {
        this.frameRequest = requestAnimationFrame(this.update)
        this.frame++
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
  }



export function titleEffect(el)
{
    let phrases = [
        'Wake up, Neo...',
        'Select a Sort',
        'The Matrix Has You...',
        'Sound Effect (bottom left)',
        'Follow The White Rabbit.',
        'Or Follow Me On GitHub',
        'Knock, Knock, Neo.',
    ]

    const fx = new TextScramble(el)
    let counter = 0
    let scramToggle = true;
    const next = () => {
        if(counter==6)
        {
            phrases = [
                'Select a Sort',
                'Sound Effect (bottom left)',
                'Sort Settings (top left)',
            ]
            counter = 0;
        }
        if(phrases.length > 4 && scramToggle)
        {
            el.style.color = "#37ec3d";
            // el.style.backgroundImage = `linear-gradient(to bottom, #2abc33, #1def24 50%)`;
            el.style.textShadow = `
                0 0 calc(1px) #ffffff00, 
                0 0 calc(1.5px) #3cd24675, 
                0 0 calc(2px) #3cd24675, 
                0 0 calc(2.5px) #3cd24675, 
                0 0 calc(3px) #3cd24675, 
                0 0 calc(3.5px) #3cd24675, 
                0 0 calc(4px) #3cd24675;`
        }
        else
        {
            el.style.color = "white";
            // el.style.backgroundImage = 'linear-gradient(to bottom, white, white 50%)';
            el.style.textShadow = `
                0 0 0 #ffffff00, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675;`
        }

        fx.setText(phrases[counter]).then(() => {
            if(phrases.length > 4 && scramToggle)
            {setTimeout(next, 600);}
            else
            {setTimeout(next, 2500);}
            scramToggle = !scramToggle;
      })
      counter = (counter + 1) % phrases.length
    }
    next();
}