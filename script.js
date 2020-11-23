const video = document.getElementById('video');

// use Promise to run the task parallel to make it quicker
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo())

function startVideo(){
    navigator.getUserMedia(
        { video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}
// startVideo()

video.addEventListener('play', () => {
    console.log('its a face!')
    setInterval(async () =>{
        const detections = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections)
        const resized = faceapi.resizeResults(detections,displaySize)
        // clear the rectangle each time new value comes up
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas, resized)
        //draw more details to the face
        faceapi.draw.drawFaceLandmarks(canvas, resized)
        // display the specific expressions
        faceapi.draw.drawFaceExpressions(canvas, resized)
    }, 100)

    //canvas
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize) // position the canvas more properly
})