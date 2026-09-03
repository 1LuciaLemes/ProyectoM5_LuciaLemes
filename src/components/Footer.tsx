export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__text">
        © {new Date().getFullYear()}{" "}
        <a
          className="site-footer__link"
          href="https://portfolio-seven-hazel-24.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lucia Lemes
        </a>
        .
      </p>
    </footer>
  );
}
