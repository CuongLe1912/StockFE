import { animate, animateChild, AnimationKeyframesSequenceMetadata, group, keyframes, query as q, style, transition, trigger } from '@angular/animations';
const query = (s,a,o={optional:true})=>q(s,a,o);

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter, :leave', style({ position: 'fixed', width:'100%',height:'100%' })),
    query(':enter', style({ transform: 'translateX(100%)' })),
    
    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('1.0s ease-in-out', style({transform: 'translateX(-100%)'}))
      ]),
      query(':enter', [
        animate('1.0s ease-in-out', style({transform: 'translateX(0%)'})),
        animateChild()
      ])
    ]),
  ]),
]);

// const sharedStyles = {
//     left: '70px',
//     width: '100%',
//     height: '100%',
//     position: 'fixed',
//     overflow: 'hidden',
//     backfaceVisibility: 'hidden',
//     transformStyle: 'preserve-3d',
// };

// export const scaleDown: AnimationKeyframesSequenceMetadata =
//     keyframes([
//         style({ opacity: '1', transform: 'scale(1)', offset: 0 }),
//         style({ opacity: '0', transform: 'scale(0.8)', offset: 1 })
//     ]);

// export const moveFromLeftKeyframes: AnimationKeyframesSequenceMetadata =
//     keyframes([
//         style({ transform: 'translateX(-90%)', offset: 0, 'z-index': '9999' }),
//         style({ transform: 'translateX(0%)', offset: 0 })
//     ]);

// export const routerTransition = trigger('routerTransition', [
//     transition('* => *', [
//         query(':enter, :leave', style(sharedStyles)
//             , { optional: true }),
//         group([
//             query(':enter', [
//                 animate('{{enterTiming}}s {{enterDelay}}s ease', moveFromLeftKeyframes)
//             ], { optional: true }),
//             query(':leave', [
//                 animate('{{leaveTiming}}s {{leaveDelay}}s ease', scaleDown)
//             ], { optional: true }),
//         ]),
//     ], { params: { enterTiming: '0.6', leaveTiming: '0.7', enterDelay: '0', leaveDelay: '0' } })
// ]);