import React from 'react';

const RandomCats: React.FC = () => {
    const isRandomlyShown = Math.random() > 0.995;

    if (!isRandomlyShown)
        return (null);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div
                    
                style={{
                    width: '0px',
                    position: 'relative',
                }}
            >
                <video
                    src="https://user-uploads.perchance.org/file/da1bf91d3531f0c92e59e6db38e44176.webm"
                    style={{
                        maxWidth: '7rem',
                        position: 'absolute',
                        top: '-10.6rem',
                        right: '-22.8rem',
                        zIndex: -1,
                        pointerEvents: 'none',
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                />
            </div>
        </div>
    );
};

export default RandomCats;