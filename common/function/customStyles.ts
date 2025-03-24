export const customStyles = `
    .rbc-current-time-indicator {
        background-color: red;
        height: 2px;
        z-index: 10;
    }
	.rbc-current-time-indicator::before,
    .rbc-current-time-indicator::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background-color: red;
        border-radius: 50%;
        top: -2px;
    }
    .rbc-current-time-indicator::before {left: 0;}
    .rbc-current-time-indicator::after {right: 0;}
`;