const trees = [
  { name: "Coast Redwood", place: "California", fact: "The tallest living trees on Earth.", mark: "01" },
  { name: "Baobab", place: "Madagascar", fact: "A living reservoir built for dry seasons.", mark: "02" },
  { name: "Bristlecone Pine", place: "Great Basin", fact: "Some have watched 4,800 winters pass.", mark: "03" },
];

export default function Home() {
  return (
    <main>
      <nav>
        <a className="brand" href="#top">CANOPY<span>®</span></a>
        <div className="navlinks"><a href="#stories">Stories</a><a href="#roots">Our roots</a></div>
        <a className="pill" href="#explore">Explore trees ↗</a>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow">A field guide to the quiet giants</div>
        <h1>STAY<br/><em>WILD.</em></h1>
        <p className="intro">Trees hold our histories, shape our climates, and make the air worth breathing. Meet the remarkable species standing watch around the world.</p>
        <a className="circle" href="#explore" aria-label="Scroll to explore trees">↓</a>
        <div className="sun" aria-hidden="true"></div>
        <div className="forest" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </section>

      <section className="manifesto" id="roots">
        <span>ROOTED IN WONDER</span>
        <p>A tree is not a thing.<br/>It is a <em>community.</em></p>
        <small>From the fungal networks below to the restless canopy above, every tree is a world in motion.</small>
      </section>

      <section className="explore" id="explore">
        <header><div><span className="kicker">FIELD NOTES / 2026</span><h2>Meet the<br/><em>ancients.</em></h2></div><p>Three icons. Three survival stories.<br/>One connected planet.</p></header>
        <div className="cards" id="stories">
          {trees.map((tree, index) => <article key={tree.name}>
            <div className={`tree-art tree-${index + 1}`}><span>{tree.mark}</span><b></b></div>
            <div className="card-copy"><small>{tree.place}</small><h3>{tree.name}</h3><p>{tree.fact}</p><a href={`https://en.wikipedia.org/wiki/${tree.name.replaceAll(" ", "_")}`}>Discover the story ↗</a></div>
          </article>)}
        </div>
      </section>

      <footer><a className="brand" href="#top">CANOPY®</a><p>Look up. Stay curious.<br/>Protect what grows.</p><span>Made for the trees • 2026</span></footer>
    </main>
  );
}
