// 极简版：自动读取同目录 words.json；无设置、无缓存；只做“知道/不知道 → 显示释义 → 继续”。
// 若部署到 GitHub Pages/任何静态托管即可、也可本地起个小服务(如 Python: python -m http.server)。

const $ = (s) => document.querySelector(s);
const pick = $("#pick");
const unitsWrap = $("#units");
const msg = $("#load-msg");
const quiz = $("#quiz");
const wordEl = $("#word");
const defEl = $("#def");
const bar = $("#bar");
const backBtn = $("#back");
const knownBtn = $("#known");
const unknownBtn = $("#unknown");
const actions = $("#actions");
const contWrap = $("#cont-wrap");
const contBtn = $("#continue");

let DATA = null;
let queue = [];
let current = null;
let lastChoice = null; // 'known' | 'unknown'
let currentUnitId = null;

init();

async function init(){
  try {
    // 自动加载 words.json
    const res = await fetch("./words.json", { cache: "no-store" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    const raw = await res.json();
    DATA = normalize(raw);
    buildUnits();
    msg.textContent = "已载入词库";
  } catch (e){
    console.error(e);
    msg.textContent = "未能读取 words.json。请确认它与 index.html 在同一目录并可被访问。";
  }
}

function normalize(raw){
  // 兼容 w/def 或 word/definition
  const out = { units: [] };
  if (!raw || !Array.isArray(raw.units)) return out;
  raw.units.forEach((u, i) => {
    if (!u) return;
    const id = toId(u.id, i);
    const title = u.title ?? `Sentence ${String(id).padStart(2,"0")}`;
    const words = [];
    (u.words || []).forEach(it => {
      if (!it) return;
      const w = it.w ?? it.word ?? it.term ?? "";
      const d = it.def ?? it.definition ?? it.meaning ?? "";
      if (!w) return;
      words.push({ w: String(w), def: String(d) });
    });
    out.units.push({ id, title, words });
  });
  out.units.sort((a,b)=>a.id-b.id);
  return out;
}

function toId(v, idx){
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string"){
    const m = v.match(/\d+/);
    if (m) return Number(m[0]);
  }
  return idx + 1;
}

function buildUnits(){
  unitsWrap.innerHTML = "";
  (DATA.units || []).forEach(u => {
    const b = document.createElement("button");
    b.className = "unit";
    b.type = "button";
    b.textContent = `#${u.id}`;
    b.onclick = () => startUnit(u.id);
    unitsWrap.appendChild(b);
  });
}

function startUnit(id){
  const u = (DATA.units || []).find(x => x.id === id);
  if (!u || !u.words || u.words.length === 0){
    msg.textContent = "该单元没有单词";
    return;
  }
  currentUnitId = id;
  queue = [...u.words]; // 本轮只按该单元
  lastChoice = null;
  showQuiz();
  nextCard();
}

function showQuiz(){
  pick.classList.add("hidden");
  quiz.classList.remove("hidden");
  actions.classList.remove("hidden");
  contWrap.classList.add("hidden");
  defEl.classList.add("hidden");
}

function backToPick(){
  quiz.classList.add("hidden");
  pick.classList.remove("hidden");
}

function nextCard(){
  if (queue.length === 0){
    wordEl.textContent = "本单元完成 🎉";
    defEl.textContent = "返回可以选择其他单元";
    defEl.classList.remove("hidden");
    actions.classList.add("hidden");
    contWrap.classList.remove("hidden");
    contBtn.textContent = "返回选择单元";
    lastChoice = "done";
    bar.textContent = "";
    return;
  }
  current = queue[0];
  wordEl.textContent = current.w || "";
  defEl.textContent = current.def || "(此词暂无释义)";
  defEl.classList.add("hidden");
  actions.classList.remove("hidden");
  contWrap.classList.add("hidden");
  bar.textContent = `剩余 ${queue.length}`;
}

knownBtn.onclick = () => pickAnswer("known");
unknownBtn.onclick = () => pickAnswer("unknown");
backBtn.onclick = () => backToPick();
contBtn.onclick = () => proceed();

$("#card").onclick = () => {
  // 支持点卡片也能查看释义（可选）
  if (defEl.classList.contains("hidden")){
    defEl.classList.remove("hidden");
  } else {
    defEl.classList.add("hidden");
  }
};

function pickAnswer(choice){
  lastChoice = choice; // 记录本题选择
  // 先显示释义，隐藏两个选项，给出“继续”
  defEl.classList.remove("hidden");
  actions.classList.add("hidden");
  contWrap.classList.remove("hidden");
  contBtn.textContent = "继续";
}

function proceed(){
  // 完成态
  if (lastChoice === "done"){ 
    backToPick(); 
    return; 
  }
  // 从队头移除当前
  const cur = queue.shift();
  if (lastChoice === "unknown"){
    // 放回队列尾部
    queue.push(cur);
  }
  // 准备下一题
  nextCard();
}
