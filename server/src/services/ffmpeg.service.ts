export class FFmpegService {
  static async processVideo(input?: any): Promise<any> {
    return input;
  }

  static async overlayAudio(videoPath?: any, audioPath?: any, outputPath?: any): Promise<any> {
    return outputPath || videoPath;
  }

  static async mergeVideos(videoPaths?: any, outputPath?: any): Promise<any> {
    return outputPath;
  }
}
