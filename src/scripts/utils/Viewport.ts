import EventEmitter from './EventEmitter';

export default class Viewport extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;
  aspect: number;
  aspectV: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.aspect = this.width / this.height;
    this.aspectV = this.height / this.width;

    let prevWidth = window.innerWidth;
    let prevHeight = window.innerHeight;
    const initWidth = prevWidth;

    const checkWidth = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const widthChanged = prevWidth !== w;
      const heightChanged = initWidth >= 991 && prevHeight !== h;

      if (widthChanged || heightChanged) {
        this.width = w;
        this.height = h;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.aspect = this.width / this.height;
        this.aspectV = this.height / this.width;
        this.trigger('resize');
      }
      prevWidth = w;
      prevHeight = h;
    };

    const debounce = (fn: () => void, ms: number) => {
      let timer: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, ms);
      };
    };

    window.addEventListener('resize', debounce(checkWidth, 300));
  }
}
