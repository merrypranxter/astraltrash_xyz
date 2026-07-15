import './AstralMerry.css';

export function AstralMerry() {
  return (
    <aside className="astral-merry-sticker" aria-label="Cartoon portrait of Merry">
      <span className="astral-merry-sticker__aura" aria-hidden="true" />
      <span className="astral-merry-sticker__stage" aria-hidden="true">
        <img
          className="astral-merry-sticker__ghost astral-merry-sticker__ghost--cyan"
          src="/merry/merry-no-freckles.svg"
          alt=""
        />
        <img
          className="astral-merry-sticker__ghost astral-merry-sticker__ghost--pink"
          src="/merry/merry-no-freckles.svg"
          alt=""
        />
        <img
          className="astral-merry-sticker__body"
          src="/merry/merry-no-freckles.svg"
          alt=""
        />
      </span>
    </aside>
  );
}
