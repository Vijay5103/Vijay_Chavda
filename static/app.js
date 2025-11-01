// static/app.js
(function(){
  const DATA_URL = './static/data/resume.json';
  const FORM_ENDPOINT = 'https://formspree.io/f/your_form_id'; // TODO: replace with your Formspree form ID

  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    wireContactForm();
  });

  async function loadData(){
    try{
      const res = await fetch(DATA_URL, {cache: 'no-store'});
      const data = await res.json();
      window.__resumeData = data;
      renderBrand(data.personal?.name);
      renderHeroName(data.personal?.name);
      renderAbout(data.about?.summary || []);
      renderCoder(data.coder || {});
      renderExperiences(data.experiences || []);
      renderSkills(data.skills || []);
      renderProjects(data.projects || []);
      renderEducation(data.education || []);
      renderContact(data.contact || {});
      initTyped(data.hero?.typedStrings || []);
      renderFooterName(data.personal?.name);
    }catch(err){
      console.error('Failed to load resume data', err);
      const rootErr = document.getElementById('about-summary');
      if(rootErr){ rootErr.innerHTML = '<p class="text-red-400 text-sm">Failed to load resume.json. Ensure static/data/resume.json exists and paths are correct.</p>'; }
    }
  }

  function renderBrand(name){
    if(!name) return;
    const el = document.getElementById('brand-name');
    if(el) el.textContent = name;
  }

  function renderFooterName(name){
    const el = document.getElementById('footer-name');
    if(el && name) el.textContent = name;
  }

  function renderHeroName(name){
    const el = document.getElementById('hero-name');
    if(el && name) el.textContent = name;
  }

  function renderAbout(paragraphs){
    const root = document.getElementById('about-summary');
    if(!root) return;
    root.innerHTML = (paragraphs || []).map((t, i) => `
      <p class="text-gray-200 text-sm lg:text-lg${i>0 ? ' mt-3':''}">${escapeHtml(t)}</p>
    `).join('');
  }

  function renderCoder(c){
    const root = document.getElementById('coder-block');
    if(!root || !c) return;
    const skills = (c.skills||[]).map((s, idx, arr)=> `
      <span class=\"text-amber-300\">${escapeHtml(s)}</span>${idx < arr.length-1 ? "<span class=\\\"text-gray-400\\\">', '</span>" : ''}
    `).join('');
    root.innerHTML = `
      <div class="blink">
        <span class="mr-2 text-pink-500">const</span>
        <span class="mr-2 text-white">coder</span>
        <span class="mr-2 text-pink-500">=</span>
        <span class="text-gray-400">{</span>
      </div>
      <div>
        <span class="ml-4 lg:ml-8 mr-2 text-white">name:</span>
        <span class="text-gray-400">'</span>
        <span class="text-amber-300">${escapeHtml(c.name||'')}</span>
        <span class="text-gray-400">',</span>
      </div>
      <div class="ml-4 lg:ml-8 mr-2">
        <span class="text-white">skills:</span>
        <span class="text-gray-400">['</span>${skills}<span class="text-gray-400">']</span>
      </div>
      <div>
        <span class="ml-4 lg:ml-8 mr-2 text-white">hardWorker:</span>
        <span class="text-orange-400">${c.hardWorker ? 'true':'false'}</span>
        <span class="text-gray-400">,</span>
      </div>
      <div>
        <span class="ml-4 lg:ml-8 mr-2 text-white">quickLearner:</span>
        <span class="text-orange-400">${c.quickLearner ? 'true':'false'}</span>
        <span class="text-gray-400">,</span>
      </div>
      <div>
        <span class="ml-4 lg:ml-8 mr-2 text-white">problemSolver:</span>
        <span class="text-orange-400">${c.problemSolver ? 'true':'false'}</span>
        <span class="text-gray-400">,</span>
      </div>
      <div>
        <span class="ml-4 lg:ml-8 mr-2 text-green-400">hireable:</span>
        <span class="text-orange-400">function</span>
        <span class="text-gray-400">() {</span>
      </div>
      <div>
        <span class="ml-8 lg:ml-16 mr-2 text-orange-400">return</span>
        <span class="text-gray-400">(</span>
      </div>
      <div>
        <span class="ml-12 lg:ml-24 text-cyan-400">this.</span>
        <span class="mr-2 text-white">hardWorker</span>
        <span class="text-amber-300">&&</span>
      </div>
      <div>
        <span class="ml-12 lg:ml-24 text-cyan-400">this.</span>
        <span class="mr-2 text-white">problemSolver</span>
        <span class="text-amber-300">&&</span>
      </div>
      <div>
        <span class="ml-12 lg:ml-24 text-cyan-400">this.</span>
        <span class="mr-2 text-white">skills.length</span>
        <span class="mr-2 text-amber-300">>=</span>
        <span class="text-orange-400">7.5</span>
      </div>
      <div>
        <span class="ml-8 lg:ml-16 mr-2 text-gray-400">);</span>
      </div>
      <div><span class="ml-4 lg:ml-8 text-gray-400">};</span></div>
      <div><span class="text-gray-400">};</span></div>
    `;
  }

  function initTyped(strings){
    try{
      const arr = (strings && strings.length) ? strings : ["RPA Developer . . ." , "Automation Anywhere Developer . . ." ,"Ui Path Developer . . . ","Python Developer . . .","Web Developer . . ."];
      // eslint-disable-next-line no-undef
      new Typed(".text", { strings: arr, typeSpeed: 70, backSpeed: 50, backDelay: 1000, loop: true });
    }catch(e){ /* typed.js not loaded */ }
  }

  function renderExperiences(items){
    const root = document.getElementById('experience-list');
    if(!root) return;
    root.innerHTML = items.map((exp, idx) => experienceCard(exp, idx+1)).join('');
  }

  function experienceCard(exp, idx){
    const icon = `
      <div class="text-violet-500 transition-all duration-300 hover:scale-125">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="36" width="36" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
          <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z"></path>
        </svg>
      </div>`;
    const bullets = (exp.bullets||[]).map(b=>`<li>${escapeHtml(b)}</li>`).join('');
    return `
      <div class="glow-container-experience-${idx} glow-container box">
        <article class="glow-card glow-card-experience-${idx} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full">
          <div class="glows"></div>
          <div class="p-3 relative">
            <img alt="bg" loading="lazy" width="1080" height="200" decoding="async" class="absolute bottom-0 opacity-80" style="color: transparent" src="static/blur-23.svg" />
            <div class="flex justify-center">
              <p class="text-xs sm:text-sm text-[#16f2b3]">(${escapeHtml(exp.period||'')})</p>
            </div>
            <div class="flex items-center gap-x-8 px-3 py-5">
              ${icon}
              <div>
                <p class="text-base sm:text-xl mb-2 font-semibold uppercase">${escapeHtml(exp.role||'')}</p>
                <p class="text-sm sm:text-base text-amber-300">${escapeHtml(exp.company||'')}${exp.location? ' – '+escapeHtml(exp.location):''}</p>
                <ul class="text-sm mt-2 list-disc list-inside text-slate-300">${bullets}</ul>
              </div>
            </div>
          </div>
        </article>
      </div>`;
  }

  function renderSkills(skills){
    const root = document.getElementById('skills-list');
    if(!root) return;
    root.innerHTML = skills.map(skill => `
      <div class="rfm-child box" style="--transform: none">
        <div class="w-36 min-w-fit h-fit flex flex-col items-center justify-center transition-all duration-500 m-3 sm:m-5 rounded-lg group relative hover:scale-[1.15] cursor-pointer">
          <div class="h-full w-full rounded-lg border border-[#1f223c] bg-[#11152c] shadow-none shadow-gray-50 group-hover:border-violet-500 transition-all duration-500">
            <div class="flex -translate-y-[1px] justify-center">
              <div class="w-3/4">
                <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 p-6">
              <div class="h-8 sm:h-10">
                <img alt="${escapeHtml(skill.name)}" loading="lazy" width="40" height="40" decoding="async" class="h-full w-auto rounded-lg" src="${escapeAttr(skill.icon)}" style="color: transparent" />
              </div>
              <p class="text-white text-sm sm:text-lg">${escapeHtml(skill.name)}</p>
            </div>
          </div>
        </div>
      </div>`).join('');
  }

  function renderProjects(projects){
    const root = document.getElementById('projects-list');
    if(!root) return;
    root.innerHTML = projects.map((p, i) => projectCard(p, i+1)).join('');
  }

  function projectCard(p, idx){
    const tools = (p.tools||[]).map(t=>`<span class="text-amber-300">${escapeHtml(t)}</span>`).join("<span class=\"text-gray-400\">', '</span>");
    const contributions = (p.contributions||[]).map(c=>`<li>${escapeHtml(c)}</li>`).join('');
    const achievements = (p.achievements||[]).map(a=>`<li>${escapeHtml(a)}</li>`).join('');
    const topOffsets = ['0em','4em','8em','12em','16em','20em'];
    const top = topOffsets[(idx-1)%topOffsets.length];
    return `
      <div id="sticky-card-${idx}" class="sticky-card w-full mx-auto max-w-2xl sticky box" style="top:${top};">
        <div class="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s]">
          <div class="from-[#0d1224] border-[#1b2c68a0] relative rounded-lg border bg-gradient-to-r to-[#0a0d37] w-full">
            <div class="flex flex-row">
              <div class="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600"></div>
              <div class="h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent"></div>
            </div>
            <div class="px-4 lg:px-8 py-3 lg:py-5 relative">
              <div class="flex flex-row space-x-1 lg:space-x-2 absolute top-1/2 -translate-y-1/2">
                <div class="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-red-400"></div>
                <div class="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-orange-400"></div>
                <div class="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-green-200"></div>
              </div>
              <p class="text-center ml-3 text-[#16f2b3] text-base lg:text-xl">${escapeHtml(p.title)}</p>
            </div>
            <div class="overflow-hidden border-t-[2px] border-indigo-900 px-4 lg:px-8 py-4 lg:py-8">
              <code class="font-mono text-xs md:text-sm lg:text-base">
                <div class="blink">
                  <span class="mr-2 text-pink-500">const</span>
                  <span class="mr-2 text-white">project</span>
                  <span class="mr-2 text-pink-500">=</span>
                  <span class="text-gray-400">{</span>
                </div>
                <div>
                  <span class="ml-4 lg:ml-8 mr-2 text-white">Duration:</span><span class="text-orange-400">${escapeHtml(p.duration||'')}</span>
                </div>
                <div>
                  <span class="ml-4 lg:ml-8 mr-2 text-white">MyRole:</span><span class="text-orange-400">${escapeHtml(p.role||'')}</span>
                </div>
                <div>
                  <span class="ml-4 lg:ml-8 mr-2 text-white">Team Size:</span><span class="text-orange-400">${escapeHtml(String(p.teamSize||''))}</span>
                </div>
                <div class="ml-4 lg:ml-8 mr-2">
                  <span class="text-white">Tools:</span><span class="text-gray-400"> ['</span>${tools}<span class="text-gray-400">']</span>
                </div>
                <div class="ml-4 lg:ml-8 mr-2">
                  <span class="text-white">Project Overview:</span><span class="text-cyan-400">${escapeHtml(p.overview||'')}</span>
                </div>
                <div class="ml-4 lg:ml-8 mr-2">
                  <span class="text-white">Key Contributions:</span><span class="text-cyan-400">${contributions}</span>
                </div>
                <div class="ml-4 lg:ml-8 mr-2">
                  <span class="text-white">Achievements:</span><span class="text-cyan-400">${achievements}</span>
                </div>
                <div><span class="text-gray-400">};</span></div>
              </code>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderEducation(items){
    const root = document.getElementById('education-list');
    if(!root) return;
    root.innerHTML = items.map((e, idx) => `
      <div class="glow-container-education-${idx+1} glow-container box">
        <article class="glow-card glow-card-education-${idx+1} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full">
          <div class="glows"></div>
          <div class="p-3 relative text-white">
            <img alt="bg" loading="lazy" width="1080" height="200" decoding="async" class="absolute bottom-0 opacity-80" style="color: transparent" src="static/blur-23.svg" />
            <div class="flex justify-center">
              <p class="text-xs sm:text-sm text-[#16f2b3]">${escapeHtml(e.period||'')}</p>
            </div>
            <div class="flex items-center gap-x-8 px-3 py-5">
              <div class="text-violet-500 transition-all duration-300 hover:scale-125">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="36" width="36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
                  <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z"></path>
                </svg>
              </div>
              <div>
                <p class="text-base sm:text-xl mb-2 font-medium uppercase text-amber-300">${escapeHtml(e.degree||'')}</p>
                <p class="text-sm sm:text-base">${escapeHtml(e.school||'')}</p>
                ${e.score? `<p class=\"text-sm sm:text-base text-emerald-300\">${escapeHtml(e.score)}</p>`: ''}
              </div>
            </div>
          </div>
        </article>
      </div>`).join('');
  }

  function renderContact(c){
    setText('contact-email', c.email || '');
    setText('contact-phone', c.phone || '');
    setText('contact-location', c.location || '');
  }

  function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  }

  function wireContactForm(){
    const form = document.getElementById('contact-form');
    if(!form) return;
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const statusEl = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearStatus();
      const name = (nameEl.value||'').trim();
      const email = (emailEl.value||'').trim();
      const message = (messageEl.value||'').trim();
      let ok = true;
      if(name.length < 2){ showError(nameEl, 'Please enter your name.'); ok = false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showError(emailEl, 'Please enter a valid email.'); ok = false; }
      if(message.length < 10){ showError(messageEl, 'Message should be at least 10 characters.'); ok = false; }
      if(!ok) return;

      if(FORM_ENDPOINT.includes('your_form_id')){
        setStatus('Please configure your Formspree endpoint in static/app.js (FORM_ENDPOINT).', true);
        return;
      }

      try{
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        if(res.ok){
          setStatus('Thanks! Your message has been sent.', false);
          form.reset();
        } else {
          setStatus('Sorry, something went wrong. Please try again later.', true);
        }
      }catch(err){
        console.error(err);
        setStatus('Network error. Please try again later.', true);
      }
    });

    function showError(input, msg){
      input.setAttribute('aria-invalid', 'true');
      const err = input.nextElementSibling && input.nextElementSibling.classList.contains('field-error')
        ? input.nextElementSibling
        : createAfter(input, 'div', 'field-error text-red-400 text-xs mt-1');
      err.textContent = msg;
    }

    function clearStatus(){
      [nameEl, emailEl, messageEl].forEach(i=> i.removeAttribute('aria-invalid'));
      document.querySelectorAll('.field-error').forEach(e=> e.remove());
      setStatus('', false);
    }

    function setStatus(msg, isError){
      if(!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = isError ? 'text-red-400 text-sm' : 'text-emerald-400 text-sm';
    }
  }

  function createAfter(el, tag, className){
    const n = document.createElement(tag);
    n.className = className;
    el.insertAdjacentElement('afterend', n);
    return n;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>\"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
  }
  function escapeAttr(str){
    return escapeHtml(str);
  }
})();
