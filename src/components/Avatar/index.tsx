import React from 'react';
import clsx from 'clsx';
import defaultAvatar from  './avatar.png'
export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  className?: string;
  src?: string;
  alt?: string;
  url?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Avatar = (props: AvatarProps) => {
  const { className, src, alt, url, size = 'md', shape = 'circle', children, onClick } = props;

  const Element = url ? 'a' : 'span';
  const clickable = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!onClick || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onClick(e as unknown as React.MouseEvent<HTMLElement>);
  };

  return (
    <Element
      className={clsx(
        'Avatar',
        `Avatar--${size}`,
        `Avatar--${shape}`,
        { 'Avatar--clickable': clickable },
        className,
      )}
      href={url}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable && !url ? 'button' : undefined}
      tabIndex={clickable && !url ? 0 : undefined}
    >
      {src ? <img src={src} alt={alt}
                  onError={e => {
                    // 图片加载失败时，切换到默认头像（并且保证只替换一次，避免死循环）
                    const img = e.currentTarget;
                    if (img.src !== defaultAvatar) {
                      img.src = defaultAvatar;
                    }
                  }}/> : children}
    </Element>
  );
};
