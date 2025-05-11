import { Loading, QSpinnerIos } from 'quasar';

/*
모든 api가 완료되고 나서 progress가 안보이게 할 때
한번에 여려 api 호출시 각 api별로 group에 string을 다르게 해서
로딩 상태를 개별적으로 관리가 가능.
*/

const progressConfig = {
  /**
   * @param {string} [group='movie'] group 이름
   * @description
   * show 함수는 특정 group 이름을 받아 해당 그룹에 로딩 인디케이터를 표시합니다.
   * 기본적으로 'movie' 그룹을 사용하며, 원하는 그룹명을 지정하여
   * 개별 API 호출별로 로딩 상태를 관리할 수 있습니다.
   */
  show(group = 'movie') {
    Loading.show({
      group: group || 'movie',
      spinner: QSpinnerIos,
      spinnerColor: 'gray',
      spinnerSize: 150,
    });
  },
  hide(group = 'movie') {
    setTimeout(() => {
      Loading.hide(group);
    }, 500);
  },
  isActive: () => Loading.isActive,
};

export default progressConfig;
