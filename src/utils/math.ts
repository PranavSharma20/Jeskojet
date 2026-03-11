/**
 * Math utilities for scroll-driven animations.
 */

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between start and end by factor t (0–1). */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/** Map value from one range to another. */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return clamp(
        ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin,
        outMin,
        outMax
    );
}

/**
 * Convert a scroll progress (0–1) to a frame index (0–frameCount-1).
 */
export function progressToFrame(
    progress: number,
    frameCount: number
): number {
    const index = Math.floor(progress * (frameCount - 1));
    return clamp(index, 0, frameCount - 1);
}

/**
 * Draw an image to a canvas using "cover" fit (no letterboxing).
 */
export function drawCover(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
): void {
    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imgRatio > canvasRatio) {
        // Image is wider — fit by height, crop sides
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    } else {
        // Image is taller — fit by width, crop top/bottom
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}
