import React, { useEffect, useRef, useMemo } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { FRAME_NAMES } from '../imageNames';

const ScrollBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll();

    // Map scroll progress to frame index (0 to 191)
    const frameIndexTransformer = useTransform(
        scrollYProgress,
        [0, 1],
        [0, FRAME_NAMES.length - 1]
    );

    // Preload images
    const images = useMemo(() => {
        return FRAME_NAMES.map((name) => {
            const img = new Image();
            img.src = `${import.meta.env.BASE_URL}images/${name}`;
            return img;
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        const render = () => {
            const index = Math.round(frameIndexTransformer.get());
            const img = images[index];

            if (img && img.complete) {
                const { width, height } = canvas;
                const imgRatio = img.width / img.height;
                const canvasRatio = width / height;

                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasRatio > imgRatio) {
                    drawWidth = width;
                    drawHeight = width / imgRatio;
                    offsetX = 0;
                    offsetY = (height - drawHeight) / 2;
                } else {
                    drawWidth = height * imgRatio;
                    drawHeight = height;
                    offsetX = (width - drawWidth) / 2;
                    offsetY = 0;
                }

                context.clearRect(0, 0, width, height);
                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        // Initial render
        render();

        // Listen for scroll progress changes
        const unsubscribe = frameIndexTransformer.on('change', render);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, [images, frameIndexTransformer]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 dark:opacity-20"
            style={{ filter: 'contrast(1.1) brightness(0.9)' }}
        />
    );
};

export default ScrollBackground;
