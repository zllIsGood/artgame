/**
 * 微信接口
 * @author kei
 * @since 2019-01-29
 */
declare namespace wx {

    let request: Function;

    let login: Function;

    let checkSession: Function;

    let getSetting: Function;

    let authorize: Function;

    let getUserInfo: Function;

    let saveImageToPhotosAlbum: Function;

    let getSystemInfo: Function;

    let getMenuButtonBoundingClientRect: Function;

    let shareAppMessage: Function;

    let getLaunchOptionsSync: Function;

    let createUserInfoButton: Function;

    let onShow: Function;

    let showShareMenu: Function;

    let onShareAppMessage: Function;

    let canIUse: Function;

    let showToast: Function;

    let showLoading: Function;

    let hideLoading: Function;

    let showModal: Function;

    let getGameRecorderManager: Function;

    let createRewardedVideoAd: Function;

    let createBannerAd: Function;

    let downloadFile: Function;

    let getFileSystemManager: Function;

    let getStorage: Function;

    let getStorageSync: Function;

    let setStorage: Function;

    let setStorageSync: Function;

    let env: any;

    let onMemoryWarning: Function;

    let uploadFile: Function;

    let setUserGroup: Function;

    let setUserCloudStorage: Function;


}


declare namespace canvas {
    let toTempFilePathSync: Function;
}