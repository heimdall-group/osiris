export const useViewsStore = defineStore('views', {
  state: () => {
    return {
      state: '' as string
    }
  },
  getters: {
    getState():string {
      return this.state;
    }
  },
  actions: {
    setState(width:number):void {
      if (width > 2560) {
        this.state = 'xxl';
        return
      } else if (width > 1920) {
        this.state = 'xl';
        return
      } else if (width > 1280) {
        this.state = 'lg';
        return
      } else if (width > 960) {
        this.state = 'md';
        return
      } else if (width > 600) {
        this.state = 'sm';
        return
      } else if (width < 600) {
        this.state = 'xs';
        return
      }
    },

  },
});
