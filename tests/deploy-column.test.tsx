import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DeployColumn, deployLayout } from '@/components/DeployColumn';

describe('deployLayout', () => {
  it('2 steps (laptop): two boxes, the last arrow drops then turns into Site files', () => {
    expect(deployLayout(['git commit · main', 'wrangler deploy'])).toEqual({
      boxes: [{ y: 26, label: 'git commit · main' }, { y: 126, label: 'wrangler deploy' }],
      arrows: ['M262 66 V126', 'M262 166 V246 H152'],
    });
  });
  it('3 steps (CI): the third box sits beside Site files with a straight arrow', () => {
    expect(deployLayout(['git push · main', 'GitHub Actions', 'wrangler deploy']).arrows).toEqual([
      'M262 66 V126', 'M262 166 V226', 'M196 246 H152',
    ]);
  });
  it('never draws more than 3 boxes', () => {
    expect(deployLayout(['a', 'b', 'c', 'd']).boxes).toHaveLength(3);
  });
  it('renders every label as real text', () => {
    const html = renderToStaticMarkup(<svg><DeployColumn steps={['git commit · main', 'wrangler deploy']} /></svg>);
    expect(html).toContain('git commit · main');
    expect(html).toContain('wrangler deploy');
  });
});
