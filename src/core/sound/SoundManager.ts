/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
class SoundManager extends BaseClass {
	/**
	 * 音乐文件清理时间
	 * @type {number}
	 */
	public static CLEAR_TIME: number = 3 * 60 * 1000;

	private effect: SoundEffects;
	private bg: SoundBg;
	private effectOn: boolean;
	private bgOn: boolean;
	private currBg: string;
	private bgVolume: number;
	private effectVolume: number;
	private soundPath: {};

	/**
	 * 构造函数
	 */
	public constructor() {
		super();

		this.bgOn = true;
		this.effectOn = true;

		this.bgVolume = 0.5;
		this.effectVolume = 0.5;

		this.soundPath = {};

		this.bg = new SoundBg();
		this.bg.setVolume(this.bgVolume);

		this.effect = new SoundEffects();
		this.effect.setVolume(this.effectVolume);
	}

	public static ins(): SoundManager {
		return super.ins() as SoundManager;
	}

	/**
	 * 播放音效
	 * @param effectName
	 */
	public playEffect(effectName: string, volume: number = 0.5): void {
		// console.log(effectName)
		if (!this.effectOn)
			return;
		this.setEffectVolume(volume)
		this.effect.play(effectName);
	}

	/**播放单词发音*/
	public playWord(effectName: string, volume: number = 0.5): void {
		// console.log(effectName)
		this.setEffectVolume(volume)
		this.effect.play(effectName);
	}

	/**
	 * 播放背景音乐
	 * @param key
	 */
	public playBg(bgName?: string): void {
		let name = bgName ? bgName : Main.bgm
		this.currBg = name;
		if (!this.bgOn)
			return;

		if (!RES.hasRes(name)) {
			TimerManager.ins().doTimer(1000, 1, () => {
				this.bg.play(name, 0)
			}, this)
			return
		}
		this.bg.play(name, 0);
	}

	/**
	 * 停止背景音乐
	 */
	public stopBg(): void {
		this.bg.stop();
	}

	//点击播放
	public touchBg(): void {
		if (egret.Capabilities.isMobile && egret.Capabilities.os == 'iOS') {
			this.bg.touchPlay();
		}
	}

	/**
	 * 设置音效是否开启
	 * @param $isOn
	 */
	public setEffectOn($isOn: boolean): void {
		this.effectOn = $isOn;
	}

	/**
	 * 设置背景音乐是否开启
	 * @param $isOn
	 */
	public setBgOn($isOn: boolean): void {
		this.bgOn = $isOn;
		if (!this.bgOn) {
			this.stopBg();
		} else {
			if (this.currBg) {
				this.playBg(this.currBg);
			}
		}
	}

	/**
	 * 设置背景音乐音量
	 * @param volume
	 */
	public setBgVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		this.bgVolume = volume;
		this.bg.setVolume(this.bgVolume);
	}

	/**
	 * 获取背景音乐音量
	 * @returns {number}
	 */
	public getBgVolume(): number {
		return this.bgVolume;
	}

	/**
	 * 设置音效音量
	 * @param volume
	 */
	public setEffectVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		if (this.effectVolume != volume) {
			this.effectVolume = volume;
			this.effect.setVolume(this.effectVolume);
		}
	}

	/**
	 * 获取音效音量
	 * @returns {number}
	 */
	public getEffectVolume(): number {
		return this.effectVolume;
	}

	public getSoundPath(soundName: string): string {
		if (!this.soundPath[soundName]) {
			let data = RES["config"].getResourceWithSubkey(soundName);
			this.soundPath[soundName] = data.r.root + data.r.url
		}
		return this.soundPath[soundName] ? this.soundPath[soundName] : '';
	}
}
window["SoundManager"] = SoundManager