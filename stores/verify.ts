export const useVerifyStore = defineStore('verify', {
  state: () => {
    return {};
  },
  getters: {
  },
  actions: {
    global_required(value:string) {
      return !!value || 'Required.'
    },
    global_validate_required(arr:string) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (this.global_required(item)) {
          continue;
        } else {
          return false;
        }
      }
      return true;
    },
    text_field_email: (value:string) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(value) || 'Invalid e-mail.';
    },
    text_field_pwd_match: (value:string, repeat:string) => {
      return repeat === value ? true : 'Password doesnt match';
    },
    text_field_pwd_length: (value:string) => {
      return value.length >= 6
        ? true
        : 'Password length needs to be atleast 6 characters';
    },
    text_field_phone_number: (value:string) => {
      const pattern = /^\+[1-9]\d{10,14}$/
      return pattern.test(value) ? true : 'Invalid phone number'
    },
    text_area_caption_max_count: (value: string, maxCount: number):boolean | string  => {
      return value.length <= maxCount ? true : 'Too many characters'
    }

  },
});
