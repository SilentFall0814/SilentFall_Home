import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Lenis from 'lenis';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: '个人简介', href: '#about' },
  { label: '我的页面', href: '#other-pages' },
  { label: '联系我', href: '#contact' },
] as const;

const ABOUT_POINTS = [
  {
    title: '日常罢了',
    description: '除了这些，我也会刷视频、听音乐、偶尔发呆，和大多数人差不多，因为我真的很闲。',
  },
  {
    title: '宅男',
       description: '一天里大部分时间都在电脑前，但也会偶尔站起来走走，假装自己很健康。',
  },
  {
    title: '人类？？？',
    description: '有时候会盯着一个界面发呆，然后才意识到已经过去好几分钟。',
  },
] as const;

const OTHER_PAGES = [
  {
    id: 'notes',
    title: '个人博客',
    category: 'Web项目',
    description: '比这个网页更全面的个人页面，虽然我觉得它暂时没啥用（这个项目已经停滞了近2个月...）',
    highlights: ['个人博客', '记录', '文章'],
    detailTitle: '个人博客',
    detailText:
      '这个博客就是分享一些技术讨论、技术分享、日常琐事、日记等等的地方',
    detailCards: [
      { label: '这个博客的作用', value: '技术分享、日常记录' },
      { label: '更新频率', value: '暂时停更' },
      { label: '页面目标', value: '记录想法与个人内容沉淀' },
    ],
    actionLabel: '进入博客',
    href: 'https://blog.repea.top/',
  },
  {
    id: 'lab',
    title: 'StudyTrack',
    category: '软件项目',
    description: '一款面向学生的 Android 成绩管理与分析应用。',
    highlights: ['成绩记录', '成绩分析', '实用工具'],
    detailTitle: 'StudyTrack',
    detailText:
      '这是一个面向学生的 Android 成绩管理与分析应用，帮助学生记录和分析自己的学习成绩。',
    detailCards: [
      { label: '这个项目的作用', value: '记录成绩、查看成绩变化' },
      { label: '适合人群', value: '需要整理和分析成绩的学生' },
      { label: '项目目标', value: '做一个真正能帮到学生的实用工具' },
    ],
    actionLabel: '进入GitHub',
    href: 'https://github.com/wznb666-0814/StudyTrack',
  },
  {
    id: 'daily',
    title: '抽象页面',
    category: '啦啦啦',
    description: '因为暂时我的项目就这么多，也实在没啥可以分享的了',
    highlights: ['汪汪汪', '喵喵喵', '嘎嘎嘎'],
    detailTitle: '抽象页面',
    detailText:
      '咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎咕咕嘎嘎',
    detailCards: [
      { label: '这个页面的作用', value: '放一些抽象内容和随手想法' },
      { label: '当前状态', value: '纯娱乐，想到什么写什么' },
      { label: '页面目标', value: '让页面别太严肃，保留一点随意感' },
    ],
    actionLabel: '回到我的页面',
    href: '#other-pages',
  },
] as const;

const CONTACT_ITEMS = [
  {
    label: '163网易邮箱',
    value: 'liangjunboljb@163.com',
    description: '你有什么想和我单独说的呢？欢迎投稿！',
    href: 'mailto:liangjunboljb@163.com',
  },
  {
    label: 'QQ邮箱',
    value: 'liangjunboljb@qq.com',
    description: '163网易邮箱未及时回复时可发这里',
    href: 'mailto:liangjunboljb@qq.com',
  },
] as const;

type OtherPageId = (typeof OTHER_PAGES)[number]['id'];

type PointerState = {
  x: number;
  y: number;
};

function useViewportProfile() {
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        isCompactScreen: false,
        isCoarsePointer: false,
        prefersReducedMotion: false,
      };
    }

    return {
      isCompactScreen: window.matchMedia('(max-width: 640px)').matches,
      isCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const compactMedia = window.matchMedia('(max-width: 640px)');
    const coarseMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateProfile = () => {
      setProfile({
        isCompactScreen: compactMedia.matches,
        isCoarsePointer: coarseMedia.matches,
        prefersReducedMotion: motionMedia.matches,
      });
    };

    updateProfile();
    compactMedia.addEventListener('change', updateProfile);
    coarseMedia.addEventListener('change', updateProfile);
    motionMedia.addEventListener('change', updateProfile);
    window.addEventListener('resize', updateProfile);

    return () => {
      compactMedia.removeEventListener('change', updateProfile);
      coarseMedia.removeEventListener('change', updateProfile);
      motionMedia.removeEventListener('change', updateProfile);
      window.removeEventListener('resize', updateProfile);
    };
  }, []);

  return profile;
}

function mapPointerRange(value: number, output: readonly [number, number]) {
  const progress = (value + 1) / 2;
  return output[0] + (output[1] - output[0]) * progress;
}

// 将鼠标位移转换为平滑的视差信号，避免交互过硬。
function useParallaxPointer() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.8 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nextX = (event.clientX - centerX) / centerX;
      const nextY = (event.clientY - centerY) / centerY;

      pointerX.set(nextX);
      pointerY.set(nextY);
    };

    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [pointerX, pointerY]);

  return { springX, springY };
}

// 使用 canvas 绘制动态点阵，并叠加呼吸漂移、鼠标视差和滚动层级变化。
function DotGridCanvas({ pointer, scrollProgress }: { pointer: PointerState; scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef(pointer);
  const scrollRef = useRef(scrollProgress);

  pointerRef.current = pointer;
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const spacing = 28;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight * 1.3;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      const currentPointer = pointerRef.current;
      const currentScroll = scrollRef.current;
      const driftX = Math.sin(time * 0.00018) * 8 - currentPointer.x * 14;
      const driftY = Math.cos(time * 0.00015) * 10 - currentPointer.y * 14 + currentScroll * 40;
      const pulse = 0.72 + Math.sin(time * 0.0011) * 0.08;

      context.clearRect(0, 0, width, height);

      for (let x = -spacing; x <= width + spacing; x += spacing) {
        for (let y = -spacing; y <= height + spacing; y += spacing) {
          const px = x + driftX * ((x / width) * 0.4 + 0.8);
          const py = y + driftY * ((y / height) * 0.2 + 0.8);
          const wave = Math.sin((x + y) * 0.018 + time * 0.001) * 0.32;
          const radius = 0.95 + wave * 0.2 + currentScroll * 0.28;
          const alpha = 0.28 + pulse * 0.2 + wave * 0.08;

          context.beginPath();
          context.fillStyle = `rgba(185, 185, 185, ${Math.max(0.08, alpha)})`;
          context.arc(px, py, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      animationId = window.requestAnimationFrame(render);
    };

    resize();
    animationId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 h-[130vh] w-full opacity-0"
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        x: -pointer.x * 16,
        y: -pointer.y * 12 + scrollProgress * 50,
      }}
    />
  );
}

// 顶部导航根据滚动逐渐显现磨砂背景，贴近作品集首屏的悬浮感。
function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0 overflow-hidden">
      <defs>
        <filter id="liquid-glass-nav" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.02" numOctaves="3" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.4" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
  );
}

function Navbar({
  onNavigate,
}: {
  onNavigate: (href: string) => void;
}) {
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0.14, 0.24]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.34, 0.48]);
  const blur = useTransform(scrollY, [0, 80], [20, 28]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0.08, 0.12]);
  const background = useMotionTemplate`rgba(255, 255, 255, ${backgroundOpacity})`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;
  const liquidBackdropFilter = useMotionTemplate`url(#liquid-glass-nav) blur(${blur}px) saturate(1.22) brightness(1.08) contrast(1.04)`;
  const liquidShadow = useMotionTemplate`0 18px 50px rgba(0, 0, 0, ${shadowOpacity})`;

  return (
    <motion.header className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-4 md:px-8 md:py-4">
      <motion.div
        className="relative mx-auto flex max-w-[1320px] flex-col gap-3 overflow-hidden rounded-[1.75rem] border px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between md:rounded-full md:px-6"
        style={{
          background,
          borderColor,
          backdropFilter: liquidBackdropFilter,
          WebkitBackdropFilter: liquidBackdropFilter,
          boxShadow: liquidShadow,
        }}
      >
        <div
          className="pointer-events-none absolute inset-[1px] rounded-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.16) 24%, rgba(255, 255, 255, 0.07) 58%, rgba(255, 255, 255, 0.04) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.98), inset 0 -1px 0 rgba(255, 255, 255, 0.42), inset 0 0 24px rgba(255, 255, 255, 0.08)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[7%] top-[1px] h-[62%] w-[30%] rounded-full opacity-95"
          animate={{
            x: [0, 26, 8, 18, 0],
            y: [0, 2, -1, 1, 0],
            scaleX: [1, 1.08, 0.98, 1.04, 1],
          }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.24) 34%, rgba(255, 255, 255, 0.08) 54%, rgba(255, 255, 255, 0) 76%)',
            filter: 'blur(10px)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[34%] top-[8px] h-[36%] w-[18%] rounded-full opacity-55 mix-blend-screen"
          animate={{
            x: [0, -18, 10, -8, 0],
            y: [0, 1, -2, 1, 0],
            scale: [1, 1.06, 0.96, 1.03, 1],
          }}
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0) 76%)',
            filter: 'blur(7px)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute right-[9%] bottom-[1px] h-[48%] w-[24%] rounded-full opacity-62"
          animate={{
            x: [0, -18, -6, -14, 0],
            y: [0, -1, 2, 0, 0],
            scaleX: [1, 0.94, 1.06, 0.98, 1],
          }}
          transition={{
            duration: 9.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.12) 44%, rgba(255, 255, 255, 0) 74%)',
            filter: 'blur(12px)',
          }}
        />
        <div className="relative z-10 text-[11px] font-black tracking-[0.22em] text-ink sm:text-sm sm:tracking-[0.28em]">
          失败总是贯穿人生
        </div>
        <nav className="relative z-10 flex w-full items-center gap-2 overflow-x-auto pb-1 text-[12px] font-medium text-ink/80 md:w-auto md:justify-end md:gap-8 md:overflow-visible md:pb-0 md:text-[13px]">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
              }}
              className="shrink-0 rounded-full border border-black/8 bg-white/40 px-3 py-2 text-center backdrop-blur-sm transition duration-300 ease-expo hover:border-black/16 hover:bg-white/70 hover:text-ink md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
}

function LeoLetter({
  char,
  springX,
  springY,
  offsetX,
  offsetY,
  rotateRange,
  delay,
  className,
}: {
  char: string;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  offsetX: readonly [number, number];
  offsetY: readonly [number, number];
  rotateRange: readonly [number, number];
  delay: number;
  className?: string;
}) {
  const letterX = useTransform(springX, (value) => mapPointerRange(value, offsetX));
  const letterY = useTransform(springY, (value) => mapPointerRange(value, offsetY));
  const letterRotate = useTransform(springX, (value) => mapPointerRange(value, rotateRange));
  const letterShadow = useMotionTemplate`${letterX}px ${letterY}px 28px rgba(0, 0, 0, 0.08)`;

  return (
    <motion.span
      className={className ?? 'inline-block text-[clamp(3.3rem,9vw,8.1rem)] font-light italic tracking-[-0.08em] text-black'}
      variants={{
        initial: { opacity: 0, scale: 0.8, rotate: -11, y: 8 },
        enter: { opacity: 1, scale: 1, rotate: -5, y: 0 },
        hover: { scale: 1.05 },
      }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      style={{
        x: letterX,
        y: letterY,
        rotate: letterRotate,
        textShadow: letterShadow,
        transform: 'translateZ(54px)',
      }}
    >
      {char}
    </motion.span>
  );
}

// 将名字拆成独立字符，保留层次感更强的视差动效。
function SignatureLetters({
  springX,
  springY,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) {
  const letters = [
    { char: '失', offsetX: [-18, 12], offsetY: [-10, 8], rotate: [-6.8, -3.2], delay: 0.5 },
    { char: '败', offsetX: [-12, 9], offsetY: [-8, 7], rotate: [-6.1, -3.6], delay: 0.55 },
    { char: '总', offsetX: [-8, 7], offsetY: [-7, 6], rotate: [-5.7, -4], delay: 0.6 },
    { char: '是', offsetX: [-4, 5], offsetY: [-5, 5], rotate: [-5.2, -4.3], delay: 0.65 },
    { char: '贯', offsetX: [2, -4], offsetY: [4, -5], rotate: [-4.8, -4.9], delay: 0.7 },
    { char: '穿', offsetX: [6, -7], offsetY: [5, -6], rotate: [-4.4, -5.2], delay: 0.75 },
    { char: '人', offsetX: [10, -9], offsetY: [7, -7], rotate: [-4, -5.8], delay: 0.8 },
    { char: '生', offsetX: [14, -12], offsetY: [8, -8], rotate: [-3.6, -6.4], delay: 0.85 },
  ] as const;

  return (
    <motion.span
      className="inline-flex origin-center cursor-default items-end gap-[0.01em] sm:gap-[0.02em] md:gap-[0.03em]"
      whileHover="hover"
      initial="initial"
      animate="enter"
    >
      {letters.map((letter) => (
        <LeoLetter
          key={letter.char}
          char={letter.char}
          springX={springX}
          springY={springY}
          offsetX={letter.offsetX}
          offsetY={letter.offsetY}
          rotateRange={letter.rotate}
          delay={letter.delay}
          className="inline-block text-[clamp(1.9rem,12vw,3.8rem)] font-light italic tracking-[-0.08em] text-black sm:text-[clamp(1.8rem,4.2vw,3.8rem)] sm:tracking-[-0.12em]"
        />
      ))}
    </motion.span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-black/35 sm:text-xs sm:tracking-[0.45em]">{eyebrow}</p>
      <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:mt-5 sm:text-3xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 tracking-[0.08em] text-black/50 sm:mt-6 sm:leading-8 md:text-base md:tracking-[0.12em]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function isInternalHashLink(href: string) {
  return href.startsWith('#');
}

// 第二屏开始进入正文内容，建立清晰的个人介绍与能力概览。
function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(245,245,243,0.8)_48%,rgba(240,240,238,0.9))]" />
      <div className="relative mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="个人简介"
          title="你好！我是失败总是贯穿人生"
          description="我是一名学生，一个试图把脑子里的奇怪想法变成软件的人..."
        />

        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-black/8 bg-white/70 p-6 shadow-soft backdrop-blur-xs sm:p-8 md:rounded-[2rem] md:p-10">
            <p className="text-sm font-semibold tracking-[0.3em] text-black/30">关于我</p>
            <h3 className="mt-5 text-[1.75rem] font-semibold tracking-[-0.04em] text-black sm:text-2xl md:text-4xl">
              一个社恐、宅男、一个有着非常非常多的奇怪想法的人类
            </h3>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              平时喜欢待在电脑前折腾点东西，有时候是写点小程序，有时候只是单纯地把桌面整理得更顺眼一点。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              我对“为什么会这样”这种问题有点执念，比如会突然想做一个网页来介绍自己，然后就真的来做了个网页。
            </p>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">
              我的一些标签：
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5 text-sm text-black/60 sm:gap-3">
              <span className="rounded-full border border-black/10 px-4 py-2">宅男</span>
              <span className="rounded-full border border-black/10 px-4 py-2">社恐</span>
              <span className="rounded-full border border-black/10 px-4 py-2">抽象</span>
              <span className="rounded-full border border-black/10 px-4 py-2">伪人</span>
            </div>
          </div>

          <div className="grid gap-4">
            {ABOUT_POINTS.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 transition duration-300 ease-expo hover:-translate-y-1 hover:bg-white/70 sm:rounded-[1.75rem] sm:p-6"
              >
                <p className="text-sm font-semibold tracking-[0.22em] text-black/35">{item.title}</p>
                <p className="mt-4 text-sm leading-7 text-black/60">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OtherPagesSection({
  activePageId,
  onSelect,
  onNavigate,
}: {
  activePageId: OtherPageId;
  onSelect: (id: OtherPageId) => void;
  onNavigate: (href: string) => void;
}) {
  const activePage = useMemo(
    () => OTHER_PAGES.find((item) => item.id === activePageId) ?? OTHER_PAGES[0],
    [activePageId],
  );

  return (
    <section id="other-pages" className="relative px-4 py-20 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          eyebrow="我的一些页面"
          title="我的一些页面"
          description="这里放了一些我做过或者想保留下来的页面和项目，可以随便点开看看。"
        />

        <div className="mt-12 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-4">
            {OTHER_PAGES.map((page) => {
              const isActive = page.id === activePage.id;

              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => onSelect(page.id)}
                  className={`rounded-[1.5rem] border p-5 text-left transition duration-300 ease-expo sm:rounded-[1.75rem] sm:p-6 ${
                    isActive
                      ? 'border-black/20 bg-white shadow-soft'
                      : 'border-black/8 bg-black/[0.03] hover:border-black/14 hover:bg-white/60'
                  }`}
                >
                  <p className="text-xs tracking-[0.28em] text-black/35">{page.category}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-black sm:text-2xl">{page.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-black/58">{page.description}</p>
                </button>
              );
            })}
          </div>

          <div className="rounded-[1.75rem] border border-black/8 bg-white/75 p-6 shadow-soft backdrop-blur-xs sm:p-8 md:rounded-[2rem] md:p-10">
            <p className="text-sm font-semibold tracking-[0.3em] text-black/30">{activePage.category}</p>
            <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.05em] text-black sm:text-3xl md:text-4xl">
              {activePage.detailTitle}
            </h3>
            <p className="mt-6 text-sm leading-8 text-black/60 md:text-base">{activePage.detailText}</p>

            <div className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
              {activePage.highlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/58">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-black text-white sm:mt-10">
              <div className="grid gap-3 p-4 sm:gap-1 sm:p-6 md:grid-cols-3">
                {activePage.detailCards.map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] bg-white/8 p-4 sm:p-5">
                    <p className="text-xs tracking-[0.24em] text-white/55">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-white/82">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={activePage.href}
              onClick={(event) => {
                if (!isInternalHashLink(activePage.href)) {
                  return;
                }

                event.preventDefault();
                onNavigate(activePage.href);
              }}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-black/12 px-5 py-3 text-sm text-black transition duration-300 ease-expo hover:border-black/22 hover:bg-black/5 sm:w-auto"
            >
              {activePage.actionLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  copiedValue,
  onCopy,
}: {
  copiedValue: string | null;
  onCopy: (value: string) => void;
}) {
  return (
    <section id="contact" className="relative px-4 pb-14 pt-20 sm:px-6 md:pb-24 md:pt-28">
      <div className="mx-auto max-w-[1200px] rounded-[1.75rem] border border-black/6 bg-white/60 px-5 py-10 shadow-soft backdrop-blur-xs sm:px-8 sm:py-12 md:rounded-[2rem] md:px-10 md:py-16">
        <SectionHeading
          eyebrow="联系我"
          title="这里是主包的邮箱地址哦！"
          description="你有什么想和我单独说的呢？欢迎投稿！"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CONTACT_ITEMS.map((item) => (
            <article key={item.value} className="rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 sm:rounded-[1.75rem] sm:p-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-black/35">{item.label}</p>
              <a href={item.href} className="mt-4 block break-all text-base font-semibold text-black transition hover:opacity-75 sm:text-lg">
                {item.value}
              </a>
              <p className="mt-3 text-sm leading-7 text-black/58">{item.description}</p>
              <button
                type="button"
                onClick={() => onCopy(item.value)}
                className="mt-5 w-full rounded-full border border-black/12 px-4 py-2 text-sm text-black transition duration-300 ease-expo hover:border-black/22 hover:bg-white sm:w-auto"
              >
                {copiedValue === item.value ? '已复制邮箱' : '复制邮箱地址'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroRange, setHeroRange] = useState(1080);
  const [activePageId, setActivePageId] = useState<OtherPageId>(OTHER_PAGES[0].id);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const { isCompactScreen, isCoarsePointer, prefersReducedMotion } = useViewportProfile();
  const shouldReduceMotion = isCompactScreen || isCoarsePointer || prefersReducedMotion;
  const { springX, springY } = useParallaxPointer();
  const { scrollYProgress, scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, heroRange], [0, shouldReduceMotion ? -36 : -90]);
  const heroScale = useTransform(scrollY, [0, heroRange], [1, shouldReduceMotion ? 0.985 : 0.96]);
  const titleX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const titleY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const heroRotateX = useTransform(springY, [-1, 1], shouldReduceMotion ? [1.4, -1.4] : [4, -4]);
  const heroRotateY = useTransform(springX, [-1, 1], shouldReduceMotion ? [-1.8, 1.8] : [-5, 5]);
  const eyebrowX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-3, 3] : [-8, 8]);
  const eyebrowY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-2, 2] : [-6, 6]);
  const helloX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-5, 5] : [-14, 14]);
  const helloY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-4, 4] : [-12, 12]);
  const subtitleX = useTransform(springX, [-1, 1], shouldReduceMotion ? [-4, 4] : [-10, 10]);
  const subtitleY = useTransform(springY, [-1, 1], shouldReduceMotion ? [-3, 3] : [-8, 8]);
  const helloShadow = useMotionTemplate`${titleX}px ${titleY}px 28px rgba(0, 0, 0, 0.06)`;

  const scrollWithNonLinearEasing = useCallback((top: number) => {
    const startTop = window.scrollY;
    const distance = top - startTop;
    const duration = 1150;
    let animationId = 0;
    let startTime = 0;

    const step = (time: number) => {
      if (!startTime) {
        startTime = time;
      }

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      window.scrollTo({
        top: startTop + distance * easedProgress,
        behavior: 'auto',
      });

      if (progress < 1) {
        animationId = window.requestAnimationFrame(step);
      }
    };

    animationId = window.requestAnimationFrame(step);

    return () => {
      if (animationId) {
        window.cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleNavigate = useCallback((href: string) => {
    const target = document.querySelector<HTMLElement>(href);

    if (!target) {
      return;
    }

    const headerOffset = isCompactScreen ? 124 : 96;
    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(target, {
        offset: -headerOffset,
        duration: 1.15,
        easing: (value: number) => 1 - Math.pow(1 - value, 4),
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      scrollWithNonLinearEasing(top);
    }

    window.history.replaceState(null, '', href);
  }, [isCompactScreen, scrollWithNonLinearEasing]);

  useEffect(() => {
    const unsubscribeX = springX.on('change', (value) => {
      setPointer((prev) => ({ ...prev, x: value }));
    });

    const unsubscribeY = springY.on('change', (value) => {
      setPointer((prev) => ({ ...prev, y: value }));
    });

    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [springX, springY]);

  useEffect(() => {
    const updateRange = () => {
      setHeroRange(window.innerHeight || 1080);
    };

    updateRange();
    window.addEventListener('resize', updateRange);

    return () => {
      window.removeEventListener('resize', updateRange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      setScrollProgress(value);
    });

    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);

  useEffect(() => {
    // 让 Framer Motion 的滚动联动与 Lenis 平滑滚动保持同一节奏。
    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!copiedContact) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopiedContact(null);
    }, 1600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copiedContact]);

  const handleCopyContact = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedContact(value);
    } catch {
      setCopiedContact(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mist text-ink">
      <LiquidGlassDefs />
      <Navbar onNavigate={handleNavigate} />

      <main className="relative">
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pt-24 sm:px-6 md:min-h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,245,243,0.96))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),rgba(245,245,243,0.92)_58%,rgba(237,237,234,1))]" />

          {!shouldReduceMotion ? <DotGridCanvas pointer={pointer} scrollProgress={scrollProgress} /> : null}

          <motion.div
            className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center py-8 text-center sm:py-10"
            style={{
              y: heroY,
              scale: heroScale,
            }}
          >
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{
                x: titleX,
                y: titleY,
                rotateX: heroRotateX,
                rotateY: heroRotateY,
                transformPerspective: 1400,
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.p
                className="mb-4 text-[11px] font-semibold uppercase tracking-[0.42em] text-black/35 sm:mb-5 sm:text-[12px] sm:tracking-[0.65em] md:text-[13px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
                style={{
                  x: eyebrowX,
                  y: eyebrowY,
                }}
              >
                欢迎来到我的个人主页
              </motion.p>

              <div className="flex flex-col items-center justify-center gap-3 text-center leading-none sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4">
                <motion.span
                  className="text-[clamp(2.6rem,16vw,8.8rem)] font-black uppercase tracking-[-0.06em] text-black sm:text-[clamp(3.4rem,10vw,8.8rem)] sm:tracking-[-0.08em]"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
                  style={{
                    x: helloX,
                    y: helloY,
                    textShadow: helloShadow,
                    transform: 'translateZ(24px)',
                  }}
                >
                  HELLO,I&apos;M
                </motion.span>

                <SignatureLetters springX={springX} springY={springY} />
              </div>

              <motion.p
                className="mt-7 max-w-[22rem] text-center text-[11px] leading-6 tracking-[0.22em] text-[#888888] sm:mt-8 sm:max-w-none sm:text-[12px] sm:tracking-[0.35em] md:text-[14px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.75, ease: EASE }}
                style={{
                  x: subtitleX,
                  y: subtitleY,
                }}
              >
                失败总是贯穿人生 | Repea | 14岁 | 中国-北京
              </motion.p>

            </motion.div>

          </motion.div>
        </section>

        <AboutSection />
        <OtherPagesSection activePageId={activePageId} onSelect={setActivePageId} onNavigate={handleNavigate} />
        <ContactSection copiedValue={copiedContact} onCopy={handleCopyContact} />
      </main>
    </div>
  );
}
