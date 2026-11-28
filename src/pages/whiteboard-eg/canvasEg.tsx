import { useEffect, useRef } from "react";

export default function CanvasEg() {
    const canvasRef = useRef(null);
    useEffect(() => {
        console.log('draw...');
        if (!canvasRef.current) return;
        console.log('canvasRef:', canvasRef.current);
        let ctx = canvasRef?.current.getContext('2d');
        ctx.font = '24px serif';
        ctx.fillText('line', 100, 60);
        ctx.beginPath();
        ctx.strokeStyle = '#ff0000';
        ctx.moveTo(100, 100);
        ctx.lineTo(200, 200);
        ctx.stroke();
        ctx.closePath();

        ctx.fillText('rectangles', 100, 260)
        ctx.save();
        ctx.fillRect(100, 300, 100, 100);
        ctx.clearRect(120,320, 60, 60);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#00ff00';
        ctx.strokeRect(135, 335, 30, 30);
        ctx.restore();
        ctx.strokeRect(220, 335, 30, 30);
        ctx.closePath();

        ctx.fillText('circle', 300, 60);
        ctx.beginPath();
        ctx.arc(350, 120, 50, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.ellipse(350, 300, 50, 75, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#aaaaaa';
        ctx.fill();

        ctx.fillText('measureText', 600, 60)
        let txt = ctx.measureText('measureText');
        console.log('measureText width = ', txt.width);
    }, [canvasRef])
    
    return (
        <div style={{'margin': '16px'}}>
            <p>这一页展示canvas示例</p>
            <canvas ref={canvasRef} width="800" height="600">浏览器不支持canvas</canvas>
        </div>
    )
}