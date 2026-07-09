import { css } from "lit";

export const sharedStyles = css`
  :host {
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    -webkit-font-smoothing: antialiased;
  }

  .badge {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--badge-color, var(--primary-color));
    color: var(--text-primary-color, #fff);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
  }

  .badge img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .meta {
    color: var(--secondary-text-color);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    white-space: nowrap;
  }

  .meta .source {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button.icon-btn {
    background: none;
    border: none;
    padding: 6px;
    margin: 0;
    cursor: pointer;
    color: var(--primary-text-color);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.icon-btn:hover {
    background: var(--secondary-background-color);
  }

  @keyframes shimmer {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  .skeleton {
    background: var(--secondary-background-color);
    border-radius: 4px;
    animation: shimmer 1.4s ease-in-out infinite;
  }
`;
