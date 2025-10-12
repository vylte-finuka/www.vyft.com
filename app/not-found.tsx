import styles from '@/app/page.module.css';

export default function Custom404() {
  return (
    <div className={styles.container4}>
      <div>
        <h1 className={styles.headeronwhiteX2}>404</h1>
        <h2 className={styles.headeronwhite}>
          Sorry, this page does not exist!
        </h2>
        <p className={styles.bodyonwhite}>
          The page you are looking for cannot be found.<br />
          Go back to the homepage to continue your Vyft experience.
        </p>
        <a href="/en-EN" className={styles.modalButton} style={{marginTop: 30}}>
          Back to homepage
        </a>
      </div>
    </div>
  );
}