export type IconProps = { size?: number; className?: string };

export const IconEngine = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M1 9V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 9V11H18L16 7H8L6 9H4V17H7L8.724 20.447C8.893 20.786 9.239 21 9.618 21H16C16.552 21 17 20.552 17 20V17H20V19H22C22.552 19 23 18.552 23 18V10C23 9.448 22.552 9 22 9H20Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 13H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconVolume = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.25001 2.25H15.75M5.53126 14.25H18.4688M9.75001 2.25V6.63187C9.74992 7.19894 9.58936 7.7544 9.28689 8.23406L3.43173 17.5073C2.26876 19.3491 3.59204 21.75 5.76939 21.75H18.2306C20.408 21.75 21.7313 19.3491 20.5683 17.5073L14.7127 8.23406C14.4104 7.75435 14.25 7.19889 14.25 6.63187V2.25"
      stroke="currentColor"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
);

export const IconPower = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M7 5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 22H18C17.45 22 17 21.55 17 21V17C17 16.45 17.45 16 18 16H20C20.55 16 21 16.45 21 17V21C21 21.55 20.55 22 20 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 19H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 22H4C3.45 22 3 21.55 3 21V17C3 16.45 3.45 16 4 16H6C6.55 16 7 16.45 7 17V21C7 21.55 6.55 22 6 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 8H18C17.45 8 17 7.55 17 7V3C17 2.45 17.45 2 18 2H20C20.55 2 21 2.45 21 3V7C21 7.55 20.55 8 20 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 8H4C3.45 8 3 7.55 3 7V3C3 2.45 3.45 2 4 2H6C6.55 2 7 2.45 7 3V7C7 7.55 6.55 8 6 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.9167 16L15 12H10L12.0833 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconTransmission = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20.21 18.8604L21.64 21.0004"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M21.4142 3.58579C22.1953 4.36684 22.1953 5.63317 21.4142 6.41422C20.6332 7.19527 19.3668 7.19527 18.5858 6.41422C17.8047 5.63317 17.8047 4.36684 18.5858 3.58579C19.3668 2.80474 20.6332 2.80474 21.4142 3.58579"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 7V10C20 11.105 19.105 12 18 12H4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4142 3.58579C14.1953 4.36684 14.1953 5.63317 13.4142 6.41422C12.6332 7.19527 11.3668 7.19527 10.5858 6.41422C9.80474 5.63317 9.80474 4.36684 10.5858 3.58579C11.3668 2.80474 12.6332 2.80474 13.4142 3.58579"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.41422 3.58579C6.19527 4.36684 6.19527 5.63317 5.41422 6.41422C4.63317 7.19527 3.36684 7.19527 2.58579 6.41422C1.80474 5.63317 1.80474 4.36684 2.58579 3.58579C3.36684 2.80474 4.63317 2.80474 5.41422 3.58579"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4142 17.5858C14.1953 18.3668 14.1953 19.6332 13.4142 20.4142C12.6332 21.1953 11.3668 21.1953 10.5858 20.4142C9.80474 19.6332 9.80474 18.3668 10.5858 17.5858C11.3668 16.8047 12.6332 16.8047 13.4142 17.5858"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.41422 17.5858C6.19527 18.3668 6.19527 19.6332 5.41422 20.4142C4.63317 21.1953 3.36684 21.1953 2.58579 20.4142C1.80474 19.6332 1.80474 18.3668 2.58579 17.5858C3.36684 16.8047 4.63317 16.8047 5.41422 17.5858"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M18.0713 18.859H20.2103C20.9993 18.859 21.6403 18.218 21.6403 17.429C21.6403 16.64 20.9993 16 20.2103 16H18.0713V16.004V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconDrivetrain = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M7 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 21H18C17.4484 20.9984 17.0016 20.5516 17 20V16C17.0016 15.4484 17.4484 15.0016 18 15H20C20.5516 15.0016 20.9984 15.4484 21 16V20C20.9984 20.5516 20.5516 20.9984 20 21V21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 6V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 21H4C3.4484 20.9984 3.00165 20.5516 3 20V16C3.00161 15.4484 3.44839 15.0016 4 15H6C6.55161 15.0016 6.99839 15.4484 7 16V20C6.99835 20.5516 6.5516 20.9984 6 21V21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 9H18C17.4484 8.99835 17.0016 8.5516 17 8V4C17.0016 3.4484 17.4484 3.00165 18 3H20C20.5516 3.00165 20.9984 3.4484 21 4V8C20.9984 8.5516 20.5516 8.99835 20 9V9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 9H4C3.44839 8.99839 3.00161 8.55161 3 8V4C3.00161 3.44839 3.44839 3.00161 4 3H6C6.55161 3.00161 6.99839 3.44839 7 4V8C6.99839 8.55161 6.55161 8.99839 6 9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCountry = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 10C15 10 18.502 7.125 18.502 4.5C18.502 2.567 16.934 1 15 1C13.066 1 11.498 2.567 11.498 4.5C11.498 7.125 15 10 15 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.001 4.34961C15.139 4.34961 15.251 4.46161 15.25 4.59961C15.25 4.73761 15.138 4.84961 15 4.84961C14.862 4.84961 14.75 4.73761 14.75 4.59961C14.75 4.46161 14.862 4.34961 15.001 4.34961"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.531 4.02539C6.78 4.27139 3 8.18839 3 13.0004C3 17.9714 7.029 22.0004 12 22.0004C16.971 22.0004 21 17.9714 21 13.0004C21 10.3484 19.848 7.97239 18.023 6.32939"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00045 21.0681V20.9971C8.00045 18.9971 12.0005 19.2331 12.0005 16.9971C12.0005 14.9971 9.00045 14.9971 9.00045 11.9971C9.00045 9.16907 7.00045 8.99707 4.00045 8.99707H3.93945"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.9704 19.7195C17.8194 19.6615 17.6694 19.6005 17.5264 19.5165C16.0904 18.6765 15.6084 16.8325 16.4474 15.3965C17.2874 13.9605 19.1314 13.4785 20.5674 14.3175C20.6734 14.3795 20.7624 14.4575 20.8584 14.5295"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconAcceleration = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13.4997 4.00001C14.8321 4.00004 16.1458 4.31327 17.3348 4.91444C18.5238 5.51561 19.5549 6.38787 20.3448 7.46084C21.1346 8.53381 21.6612 9.77744 21.882 11.0914C22.1028 12.4053 22.0116 13.7528 21.6159 15.025C21.2201 16.2972 20.5308 17.4585 19.6036 18.4153C18.6763 19.3721 17.5372 20.0976 16.278 20.5331C15.0189 20.9686 13.6749 21.102 12.3547 20.9226C11.0345 20.7431 9.77496 20.2558 8.67772 19.5H1.75172C1.5617 19.5 1.37878 19.4278 1.23993 19.298C1.10108 19.1683 1.01665 18.9907 1.0037 18.8011C0.990747 18.6115 1.05024 18.4241 1.17016 18.2767C1.29007 18.1293 1.46147 18.0329 1.64972 18.007L1.75172 18L7.01972 18.001C6.6265 17.5389 6.28388 17.0361 5.99772 16.501L3.74672 16.5C3.5567 16.5 3.37378 16.4278 3.23493 16.298C3.09608 16.1683 3.01165 15.9907 2.9987 15.8011C2.98575 15.6115 3.04524 15.4241 3.16516 15.2767C3.28507 15.1293 3.45647 15.0329 3.64472 15.007L3.74672 15L5.37372 15.001C5.12505 14.1907 4.99899 13.3477 4.99972 12.5C4.99972 10.403 5.75972 8.48201 7.01872 7.00001H2.74972C2.5597 6.99995 2.37678 6.92777 2.23793 6.79804C2.09908 6.66831 2.01465 6.49071 2.0017 6.30113C1.98875 6.11155 2.04824 5.92412 2.16816 5.77671C2.28807 5.62931 2.45947 5.53291 2.64772 5.50701L2.74972 5.50001H8.67672C10.0941 4.52057 11.7768 3.99724 13.4997 4.00001ZM13.4997 5.50001C11.6432 5.50001 9.86273 6.23751 8.54998 7.55026C7.23722 8.86302 6.49972 10.6435 6.49972 12.5C6.49972 14.3565 7.23722 16.137 8.54998 17.4498C9.86273 18.7625 11.6432 19.5 13.4997 19.5C15.3562 19.5 17.1367 18.7625 18.4495 17.4498C19.7622 16.137 20.4997 14.3565 20.4997 12.5C20.4997 10.6435 19.7622 8.86302 18.4495 7.55026C17.1367 6.23751 15.3562 5.50001 13.4997 5.50001ZM13.5027 7.00201C14.2252 7.00201 14.9406 7.14431 15.6081 7.42079C16.2755 7.69726 16.882 8.1025 17.3929 8.61336C17.9037 9.12422 18.309 9.7307 18.5854 10.3982C18.8619 11.0657 19.0042 11.781 19.0042 12.5035C19.0042 13.226 18.8619 13.9414 18.5854 14.6088C18.309 15.2763 17.9037 15.8828 17.3929 16.3937C16.882 16.9045 16.2755 17.3098 15.6081 17.5862C14.9406 17.8627 14.2252 18.005 13.5027 18.005C12.0436 18.005 10.6443 17.4254 9.61258 16.3937C8.58084 15.3619 8.00122 13.9626 8.00122 12.5035C8.00122 11.0444 8.58084 9.64509 9.61258 8.61336C10.6443 7.58163 12.0436 7.00201 13.5027 7.00201ZM14.6537 14.716C14.2992 14.9005 13.9056 14.9974 13.506 14.9984C13.1063 14.9995 12.7122 14.9047 12.3567 14.722L11.2607 15.818C11.9007 16.251 12.6717 16.505 13.5027 16.505C14.3367 16.505 15.1107 16.25 15.7517 15.814L14.6537 14.716ZM9.50172 12.503C9.50172 13.339 9.75772 14.116 10.1967 14.758L11.2897 13.667C11.0994 13.3071 10.9998 12.9061 10.9997 12.499C10.9997 12.082 11.1027 11.689 11.2837 11.344L10.1927 10.254C9.74195 10.9177 9.50119 11.7007 9.50172 12.503ZM16.8177 10.262L15.7227 11.357C15.8987 11.699 15.9987 12.088 15.9987 12.5C15.9987 12.917 15.8967 13.31 15.7157 13.656L16.8137 14.753C17.2497 14.112 17.5037 13.338 17.5037 12.504C17.5037 11.674 17.2507 10.901 16.8177 10.262ZM13.4997 11.5C13.3648 11.494 13.23 11.5153 13.1035 11.5628C12.9771 11.6103 12.8615 11.6829 12.7639 11.7763C12.6663 11.8696 12.5886 11.9818 12.5355 12.106C12.4824 12.2302 12.455 12.3639 12.455 12.499C12.455 12.6341 12.4824 12.7678 12.5355 12.892C12.5886 13.0162 12.6663 13.1284 12.7639 13.2218C12.8615 13.3151 12.9771 13.3877 13.1035 13.4352C13.23 13.4827 13.3648 13.5041 13.4997 13.498C13.7569 13.4865 13.9998 13.3762 14.1778 13.1901C14.3557 13.004 14.455 12.7565 14.455 12.499C14.455 12.2415 14.3557 11.994 14.1778 11.8079C13.9998 11.6218 13.7569 11.5115 13.4997 11.5ZM13.5027 8.50201C12.7004 8.50148 11.9165 8.74224 11.2527 9.19301L12.3427 10.283C12.7014 10.0958 13.1002 9.99844 13.5048 9.99931C13.9095 10.0002 14.3078 10.0993 14.6657 10.288L15.7577 9.19701C15.093 8.74386 14.3072 8.50165 13.5027 8.50201Z"
      fill="currentColor"
    />
  </svg>
);

export const IconTopSpeed = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18.3639 5.63604C21.8787 9.15076 21.8787 14.8492 18.3639 18.3639C14.8492 21.8787 9.15074 21.8787 5.63604 18.3639C2.12132 14.8492 2.12132 9.15074 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.3639 5.63604"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.4129 19.031C17.2359 18.585 16.9609 18.185 16.6089 17.859C16.0139 17.307 15.2359 17 14.4239 17C13.0699 17 10.9299 17 9.57594 17C8.76394 17 7.98594 17.307 7.38994 17.859C7.03794 18.185 6.76394 18.585 6.58594 19.031"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.4142 10.5858C14.1953 11.3668 14.1953 12.6332 13.4142 13.4142C12.6332 14.1953 11.3668 14.1953 10.5858 13.4142C9.80474 12.6332 9.80474 11.3668 10.5858 10.5858C11.3668 9.80474 12.6332 9.80474 13.4142 10.5858"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M16.5004 4.20996L15.6304 5.70996"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.49957 4.20996L8.36957 5.70996"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.20996 7.49957L5.70996 8.36957"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21 12H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M13.79 11.13L19.79 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconFuel = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 7H12.5V11H6.5V7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7.5 15H11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M3.5 21V5C3.5 3.895 4.395 3 5.5 3H13.5C14.605 3 15.5 3.895 15.5 5V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 5L20.914 6.414C21.289 6.789 21.5 7.298 21.5 7.828V17.5C21.5 18.328 20.828 19 20 19V19C19.172 19 18.5 18.328 18.5 17.5V16C18.5 15.448 18.052 15 17.5 15H15.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.4998 12H19.6328C19.0318 12 18.5658 11.473 18.6408 10.876L18.8908 8.876C18.9528 8.376 19.3778 8 19.8828 8H21.4998"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.5 21H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconHeart = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.5 4C4.4625 4 2 6.4625 2 9.5C2 15 8.5 20 12 21.163C15.5 20 22 15 22 9.5C22 6.4625 19.5375 4 16.5 4C14.64 4 12.995 4.9235 12 6.337C11.4928 5.61469 10.819 5.0252 10.0357 4.61841C9.25238 4.21162 8.38263 3.9995 7.5 4Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconComment = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.08984 2.75C6.02898 2.75 5.01156 3.17143 4.26142 3.92157C3.51127 4.67172 3.08984 5.68913 3.08984 6.75V12.958C3.08984 14.0189 3.51127 15.0363 4.26142 15.7864C5.01156 16.5366 6.02898 16.958 7.08984 16.958H7.18284V20.75C7.18275 20.8472 7.211 20.9423 7.26413 21.0238C7.31727 21.1052 7.39298 21.1693 7.48201 21.2084C7.57103 21.2474 7.66951 21.2597 7.76539 21.2436C7.86127 21.2276 7.95039 21.1839 8.02184 21.118L12.5418 16.958H16.9108C17.9717 16.958 18.9891 16.5366 19.7393 15.7864C20.4894 15.0363 20.9108 14.0189 20.9108 12.958V6.75C20.9108 5.68913 20.4894 4.67172 19.7393 3.92157C18.9891 3.17143 17.9717 2.75 16.9108 2.75H7.08984Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconRepost = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 12L13.6 5V8.5C10.4 8.5 4 10.6 4 19C4 17.833 5.92 15.5 13.6 15.5V19L20 12Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconViews = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="Group">
      <g id="Group_2">
        <path
          id="Path"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.11799 12.467C2.96099 12.176 2.96099 11.823 3.11799 11.532C5.00999 8.033 8.50499 5 12 5C15.495 5 18.99 8.033 20.882 11.533C21.039 11.824 21.039 12.177 20.882 12.468C18.99 15.967 15.495 19 12 19C8.50499 19 5.00999 15.967 3.11799 12.467Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Path_2"
          d="M14.1213 9.87868C15.2929 11.0502 15.2929 12.9497 14.1213 14.1213C12.9497 15.2929 11.0502 15.2929 9.87868 14.1213C8.70711 12.9497 8.70711 11.0502 9.87868 9.87868C11.0502 8.70711 12.9497 8.70711 14.1213 9.87868"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export const IconArrowRight = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 7L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 17L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconBurger = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M4.5661 12.4964L8.00066 9.0618L11.4352 12.4964C11.7285 12.7897 12.204 12.7897 12.4973 12.4964C12.7906 12.2031 12.7906 11.7275 12.4973 11.4342L9.06278 7.99969L12.4974 4.5651C12.7907 4.2718 12.7907 3.79628 12.4974 3.50298C12.2041 3.20968 11.7285 3.20968 11.4352 3.50298L8.00066 6.93757L4.56608 3.50298C4.27278 3.20968 3.79725 3.20968 3.50396 3.50298C3.21066 3.79628 3.21066 4.2718 3.50396 4.5651L6.93854 7.99969L3.50398 11.4342C3.21068 11.7275 3.21068 12.2031 3.50398 12.4964C3.79727 12.7897 4.2728 12.7897 4.5661 12.4964Z" />
  </svg>
);

export const IconSort = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 13.833V14.5H3V13.833H7ZM12 9.66699V10.333H3V9.66699H12ZM17 5.5V6.16699H3V5.5H17Z"
      stroke="currentColor"
    />
  </svg>
);

export const IconChevronRight = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M10 7L15 12L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
