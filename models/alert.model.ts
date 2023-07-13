export interface Alert {
  type: 'error' | 'success' | 'warning' | 'info';
  icon: string;
  message:
    string
    | {
        prepend: string;
        button:
          | {
              type: 'button-link';
              to: string,
              text: string;
            }
          | {
              type: 'button-callback';
              callback: Function;
              text: string;
            };
        append: string;
      };
}
