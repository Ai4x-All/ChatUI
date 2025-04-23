// ComposerTips.tsx
import React from 'react';
import { Avatar } from '../Avatar';

export interface CustomComposerProps {
  tipsData?: any[];
}

export const ComposerTips = (props: CustomComposerProps ) => {
  const { tipsData=[] } = props;

  return (
    <>
      {tipsData.length ? <div className="tips">
        <Avatar className="tips-avatar" src={tipsData[0].avatar} shape="square" size="lg" />
        <span className="tips-msg">{tipsData[0].message}</span>
      </div> : null}
    </>
  )
};
