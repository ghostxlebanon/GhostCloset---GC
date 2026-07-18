import type { Metadata } from "next";
import styles from "./story.module.css";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;

export const metadata: Metadata = {
  title: "Story Showcase",
  description: "Animated Ghost Closet Drop 001 vertical showcase.",
};

export default function StoryPage() {
  return (
    <main className={styles.page}>
      <div className={styles.story} aria-label="Ghost Closet animated Instagram Story showcase">
        <div className={styles.progress} aria-hidden="true">
          <span className={`${styles.progressOne} gc-progress-one`} />
          <span className={`${styles.progressTwo} gc-progress-two`} />
          <span className={`${styles.progressThree} gc-progress-three`} />
          <span className={`${styles.progressFour} gc-progress-four`} />
        </div>

        <header className={styles.header}>
          <a href={`${BASE_PATH}/`} aria-label="Return to Ghost Closet">
            <strong>GHOST</strong><span>CLOSET</span>
          </a>
          <span>DROP 001 / STORY</span>
        </header>

        <section className={`${styles.scene} ${styles.sceneOne}`} aria-label="Enter the Closet">
          <div className={styles.scanline} aria-hidden="true" />
          <p>GHOST CLOSET / BERLIN</p>
          <h1><span>ENTER THE</span><strong>CLOSET.</strong></h1>
          <div className={styles.systemLine}><i /> LIGHTS AUTOMATICALLY ON</div>
        </section>

        <section className={`${styles.scene} ${styles.sceneTwo}`} aria-label="Male and female Ghost Closet uniforms">
          <div className={styles.acidDisc} aria-hidden="true" />
          <img className={styles.duo} src={asset("/editorial/ghost-duo-cutout.png")} alt="Masked male and female Ghost Closet models" decoding="async" fetchPriority="high" />
          <div className={styles.sceneCopy}>
            <p>TWO UNIFORMS / ONE CLOSET</p>
            <h2>CHOOSE<br />YOUR GHOST.</h2>
          </div>
        </section>

        <section className={`${styles.scene} ${styles.sceneThree}`} aria-label="Ghost Closet product details">
          <p className={styles.sceneLabel}>DARK ESSENTIALS / DETAIL STUDY</p>
          <div className={styles.productGrid}>
            <figure>
              <img src={asset("/products/specter-gloves-leather.png")} alt="Glossy black leather Specter Gloves" decoding="async" />
              <figcaption><span>GC-008</span><strong>SPECTER GLOVES</strong><em>SHINY LEATHER ONLY</em></figcaption>
            </figure>
            <figure>
              <img src={asset("/products/shadow-mask.png")} alt="Black Ghost Closet Shadow Mask" decoding="async" />
              <figcaption><span>GC-007</span><strong>SHADOW MASK</strong><em>ZERO DISTRACTIONS</em></figcaption>
            </figure>
          </div>
          <h2 className={styles.detailsHeadline}>BUILT<br />ENTIRELY<br />IN BLACK.</h2>
        </section>

        <section className={`${styles.scene} ${styles.sceneFour}`} aria-label="Ghost Closet call to action">
          <div className={styles.finalGlow} aria-hidden="true" />
          <p>GHOST CLOSET / DROP 001</p>
          <h2>SOME PEOPLE<br />WEAR CLOTHES.</h2>
          <h3>WE WEAR<br /><span>PRESENCE.</span></h3>
          <a className={styles.cta} href={`${BASE_PATH}/`}>
            <span>ENTER THE CLOSET</span><strong>↗</strong>
          </a>
          <small>SECURE OFFICIAL-STORE ROUTING / NO CARD DATA COLLECTED HERE</small>
        </section>

        <footer className={styles.footer}>
          <span>@GHOSTCLOSET</span>
          <a href={`${BASE_PATH}/`}>VIEW STORE ↗</a>
        </footer>
      </div>
    </main>
  );
}
