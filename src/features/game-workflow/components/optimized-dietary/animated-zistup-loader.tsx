type AnimatedZistupLoaderProps = {
  className?: string;
};

const AnimatedZistupLoader = ({
  className = "",
}: AnimatedZistupLoaderProps) => {
  return (
    <svg
      viewBox="0 0 209 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animated-diet-logo h-auto ${className}`.trim()}
      role="img"
      aria-hidden="true"
    >
      <style>{`
    .animated-diet-logo { overflow: visible; }
    @keyframes kf_Rectangle_66_transform_0 {
      0% {
        transform: translateX(79.545px) translateY(78.986px) translate(24.5px, 24.5px) scaleX(0.5) scaleY(0.5) translate(-24.5px, -24.5px);
      }
      25% {
        transform: translateX(79.545px) translateY(78.986px) translate(24.5px, 24.5px) scaleX(1.123) scaleY(1.123) translate(-24.5px, -24.5px);
      }
      50% {
        transform: translateX(79.545px) translateY(78.986px) translate(24.5px, 24.5px) scaleX(1.519) scaleY(1.519) translate(-24.5px, -24.5px);
      }
      75% {
        transform: translateX(79.545px) translateY(78.986px) translate(24.5px, 24.5px) scaleX(1.703) scaleY(1.703) translate(-24.5px, -24.5px);
      }
      100% {
        transform: translateX(79.545px) translateY(78.986px) translate(24.5px, 24.5px) scaleX(1.712) scaleY(1.712) translate(-24.5px, -24.5px);
      }
    }
    .animated-diet-logo #Rectangle_66,
    .animated-diet-logo #Rectangle_66_Glow {
      transform-origin: 0 0;
      animation: kf_Rectangle_66_transform_0 2s linear infinite alternate;
    }
    @keyframes kf_Vector_transform_0 {
      0% {
        transform: translateX(208.545px) translateY(116.936px) translate(-104.273px, -12.943px) rotate(0rad) translate(104.273px, 12.943px) rotate(2.49rad) scaleX(1) scaleY(1);
      }
      25% {
        transform: translateX(208.545px) translateY(116.936px) translate(-104.273px, -12.943px) rotate(0.068rad) translate(104.273px, 12.943px) rotate(2.49rad) scaleX(1) scaleY(1);
      }
      50% {
        transform: translateX(208.545px) translateY(116.936px) translate(-104.273px, -12.943px) rotate(0.27rad) translate(104.273px, 12.943px) rotate(2.49rad) scaleX(1) scaleY(1);
      }
      75% {
        transform: translateX(208.545px) translateY(116.936px) translate(-104.273px, -12.943px) rotate(0.609rad) translate(104.273px, 12.943px) rotate(2.49rad) scaleX(1) scaleY(1);
      }
      100% {
        transform: translateX(208.545px) translateY(116.936px) translate(-104.273px, -12.943px) rotate(1.067rad) translate(104.273px, 12.943px) rotate(2.49rad) scaleX(1) scaleY(1);
      }
    }
    .animated-diet-logo #Vector,
    .animated-diet-logo #Vector_Glow {
      transform-origin: 0 0;
      animation: kf_Vector_transform_0 2s linear infinite alternate;
    }
    @keyframes kf_Vector_2_transform_0 {
      0% {
        transform: translateX(191.545px) translateY(171.049px) translate(-87.152px, -65.854px) rotate(0rad) translate(87.152px, 65.854px) rotate(3.013rad) scaleX(1) scaleY(1) skewX(0rad);
      }
      100% {
        transform: translateX(191.545px) translateY(171.049px) translate(-87.152px, -65.854px) rotate(-1.257rad) translate(87.152px, 65.854px) rotate(3.013rad) scaleX(1) scaleY(1) skewX(0rad);
      }
    }
    .animated-diet-logo #Vector_2,
    .animated-diet-logo #Vector_2_Glow {
      transform-origin: 0 0;
      animation: kf_Vector_2_transform_0 2s linear infinite alternate;
    }
    `}</style>
      <g id="Group_42">
        {/* Glow is isolated so the visible edge stays sharp during animation. */}
        <g
          id="Rectangle_66_Glow"
          filter="url(#filter0_d_9801_9048)"
          transform="translate(79.5451 78.9864)"
          opacity="0.72"
        >
          <rect
            width="49"
            height="49"
            rx="20.4776"
            fill="#75D5F6"
            fillOpacity="0.18"
            shapeRendering="geometricPrecision"
          />
        </g>

        <g id="Rectangle_66" transform="translate(79.5451 78.9864)">
          <rect
            width="49"
            height="49"
            rx="20.4776"
            id="Rectangle_66_bg_0"
            fill="#75D5F6"
            fillOpacity="0.18"
            shapeRendering="geometricPrecision"
          />
        </g>
        <g
          id="Vector_Glow"
          filter="url(#filter1_di_9801_9048)"
          transform="translate(208.545 116.936) rotate(142.651)"
          opacity="0.62"
        >
          <path
            d="M30.4803 24.132L40.2809 27.117C47.4435 29.2984 55.081 25.6062 57.8182 18.6368L61.5652 9.1023C66.3272 -3.01277 83.4626 -3.04147 88.2637 9.06055L92.0394 18.5846C94.8 25.5462 102.448 29.2123 109.603 27.0101L119.393 23.9937C131.834 20.1632 142.54 33.5438 136.072 44.8395L130.981 53.7295C127.26 60.2267 129.16 68.493 135.346 72.7149L143.808 78.4893C154.561 85.8267 150.773 102.539 137.909 104.528L127.784 106.091C120.384 107.234 115.106 113.872 115.662 121.34L116.423 131.555C117.392 144.536 101.963 151.996 92.389 143.177L84.8533 136.236C79.3451 131.164 70.8648 131.177 65.3722 136.267L57.8599 143.232C48.3124 152.083 32.8627 144.669 33.789 131.685L34.517 121.467C35.0493 114 29.7497 107.374 22.3471 106.255L12.2177 104.723C-0.654053 102.777 -4.49236 86.0772 6.23716 78.7059L14.6809 72.9054C20.852 68.6652 22.7281 60.3937 18.9863 53.9069L13.8668 45.0326C7.36177 33.7551 18.0261 20.3406 30.4803 24.1346V24.132Z"
            stroke="#75D5F6"
            strokeWidth="1.90212"
            strokeMiterlimit="10"
            fill="none"
            shapeRendering="geometricPrecision"
          />
        </g>

        <g id="Vector" transform="translate(208.545 116.936) rotate(142.651)">
          <path
            d="M30.4803 24.132L40.2809 27.117C47.4435 29.2984 55.081 25.6062 57.8182 18.6368L61.5652 9.1023C66.3272 -3.01277 83.4626 -3.04147 88.2637 9.06055L92.0394 18.5846C94.8 25.5462 102.448 29.2123 109.603 27.0101L119.393 23.9937C131.834 20.1632 142.54 33.5438 136.072 44.8395L130.981 53.7295C127.26 60.2267 129.16 68.493 135.346 72.7149L143.808 78.4893C154.561 85.8267 150.773 102.539 137.909 104.528L127.784 106.091C120.384 107.234 115.106 113.872 115.662 121.34L116.423 131.555C117.392 144.536 101.963 151.996 92.389 143.177L84.8533 136.236C79.3451 131.164 70.8648 131.177 65.3722 136.267L57.8599 143.232C48.3124 152.083 32.8627 144.669 33.789 131.685L34.517 121.467C35.0493 114 29.7497 107.374 22.3471 106.255L12.2177 104.723C-0.654053 102.777 -4.49236 86.0772 6.23716 78.7059L14.6809 72.9054C20.852 68.6652 22.7281 60.3937 18.9863 53.9069L13.8668 45.0326C7.36177 33.7551 18.0261 20.3406 30.4803 24.1346V24.132Z"
            stroke="#75D5F6"
            strokeWidth="1.90212"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          />
        </g>
        <g
          id="Vector_2_Glow"
          filter="url(#filter2_di_9801_9048)"
          transform="translate(191.545 171.049) rotate(172.651)"
          opacity="0.62"
        >
          <path
            d="M31.6875 25.0877L41.8762 28.191C49.3225 30.4588 57.2624 26.6204 60.108 19.3749L64.0034 9.46279C68.954 -3.13208 86.768 -3.16192 91.7593 9.41939L95.6846 19.3206C98.5545 26.558 106.505 30.3693 113.943 28.0798L124.121 24.9439C137.055 20.9618 148.185 34.8723 141.461 46.6154L136.168 55.8574C132.3 62.6119 134.275 71.2056 140.707 75.5947L149.504 81.5978C160.683 89.2258 156.744 106.6 143.37 108.667L132.845 110.292C125.152 111.48 119.664 118.381 120.242 126.145L121.034 136.765C122.041 150.261 106.001 158.016 96.048 148.847L88.2139 141.632C82.4875 136.358 73.6713 136.372 67.9612 141.664L60.1514 148.904C50.2258 158.106 34.1642 150.399 35.1271 136.901L35.884 126.278C36.4374 118.514 30.9279 111.627 23.2321 110.463L12.7016 108.871C-0.679956 106.847 -4.67028 89.4862 6.48418 81.823L15.2623 75.7927C21.6778 71.3847 23.6282 62.7855 19.7382 56.0419L14.416 46.8161C7.65333 35.092 18.74 21.1462 31.6875 25.0904V25.0877Z"
            stroke="#75D5F6"
            strokeWidth="1.90212"
            strokeMiterlimit="10"
            fill="none"
            shapeRendering="geometricPrecision"
          />
        </g>

        <g id="Vector_2" transform="translate(191.545 171.049) rotate(172.651)">
          <path
            d="M31.6875 25.0877L41.8762 28.191C49.3225 30.4588 57.2624 26.6204 60.108 19.3749L64.0034 9.46279C68.954 -3.13208 86.768 -3.16192 91.7593 9.41939L95.6846 19.3206C98.5545 26.558 106.505 30.3693 113.943 28.0798L124.121 24.9439C137.055 20.9618 148.185 34.8723 141.461 46.6154L136.168 55.8574C132.3 62.6119 134.275 71.2056 140.707 75.5947L149.504 81.5978C160.683 89.2258 156.744 106.6 143.37 108.667L132.845 110.292C125.152 111.48 119.664 118.381 120.242 126.145L121.034 136.765C122.041 150.261 106.001 158.016 96.048 148.847L88.2139 141.632C82.4875 136.358 73.6713 136.372 67.9612 141.664L60.1514 148.904C50.2258 158.106 34.1642 150.399 35.1271 136.901L35.884 126.278C36.4374 118.514 30.9279 111.627 23.2321 110.463L12.7016 108.871C-0.679956 106.847 -4.67028 89.4862 6.48418 81.823L15.2623 75.7927C21.6778 71.3847 23.6282 62.7855 19.7382 56.0419L14.416 46.8161C7.65333 35.092 18.74 21.1462 31.6875 25.0904V25.0877Z"
            stroke="#75D5F6"
            strokeWidth="1.90212"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            shapeRendering="geometricPrecision"
          />
        </g>
        <g id="Group" transform="translate(79.5451 75.877)">
          <path
            id="Vector_3"
            transform="translate(-0.000772665 3.13148)"
            d="M49.5967 20.6713V28.1966C49.5967 39.7991 40.181 49.2049 28.5633 49.2049H21.0333C9.41564 49.2049 0 39.7991 0 28.1966V20.6713C0 10.4722 7.27056 1.97655 16.914 0.0644026C18.9642 -0.343311 20.872 1.23697 20.872 3.32927V23.7876C20.872 27.5013 25.0103 29.7232 28.1109 27.672L44.4048 16.8881C46.5562 15.4659 49.4258 16.926 49.565 19.4987C49.5872 19.8843 49.5967 20.2762 49.5967 20.6682V20.6713Z"
            fill="#3EBFB9"
            shapeRendering="geometricPrecision"
          />
          <path
            id="Vector_4"
            transform="translate(24.7978 -0.00051511)"
            d="M16.721 13.5905C15.7908 16.2802 14.0349 18.6538 11.6683 20.3352C11.6462 20.3478 11.6272 20.3636 11.605 20.3763L1.84454 27.1525C1.08837 27.6772 0.0537771 27.1399 0.0506133 26.2202L0.00631459 15.1961L0 14.1278C0.0949158 11.4098 0.993442 8.80545 2.54057 6.63097C4.26804 4.18153 6.8118 2.27887 9.91238 1.36231L14.4304 0.0380278C14.9271 -0.107358 15.446 0.177093 15.5915 0.670142L16.9203 5.18027C17.7619 8.04691 17.6354 10.9673 16.7242 13.5937L16.721 13.5905Z"
            fill="#3EBFB9"
            shapeRendering="geometricPrecision"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_9801_9048"
          x="-20.0388"
          y="-20.0388"
          width="89.0776"
          height="89.0776"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10.0194" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.458824 0 0 0 0 0.835294 0 0 0 0 0.964706 0 0 0 0.65 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9801_9048"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9801_9048"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_di_9801_9048"
          x="-54.2024"
          y="-51.9562"
          width="253.664"
          height="254.134"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.60847" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.458824 0 0 0 0 0.835294 0 0 0 0 0.964706 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9801_9048"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9801_9048"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="12.2369" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.458824 0 0 0 0 0.835294 0 0 0 0 0.964706 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_9801_9048"
          />
        </filter>
        <filter
          id="filter2_di_9801_9048"
          x="-24.8952"
          y="-26.5862"
          width="209.787"
          height="210.216"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.60847" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.458824 0 0 0 0 0.835294 0 0 0 0 0.964706 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9801_9048"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9801_9048"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10.4616" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.458824 0 0 0 0 0.835294 0 0 0 0 0.964706 0 0 0 0.73 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_9801_9048"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default AnimatedZistupLoader;
