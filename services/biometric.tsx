import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

export class BiometricService {
  private static async runPythonScript(scriptName: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn('python', [
        join(__dirname, 'scripts', scriptName),
        ...args
      ]);

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
        } else {
          resolve(output.trim());
        }
      });
    });
  }

  private static async saveTempBiometricData(data: Buffer): Promise<string> {
    const tempPath = join(process.cwd(), 'temp', `${randomBytes(16).toString('hex')}.dat`);
    await writeFile(tempPath, data);
    return tempPath;
  }

  static async generateKeypair(biometricData: Buffer): Promise<{ publicKey: string; privateKey: string }> {
    try {
      const tempPath = await this.saveTempBiometricData(biometricData);
      const result = await this.runPythonScript('generate_keypair.py', [tempPath]);
      await unlink(tempPath);

      const [publicKey, privateKey] = result.split('\n');
      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(`Failed to generate keypair: ${error.message}`);
    }
  }

  static async verifyBiometric(biometricData: Buffer, publicKey: string): Promise<boolean> {
    try {
      const tempPath = await this.saveTempBiometricData(biometricData);
      const result = await this.runPythonScript('verify.py', [tempPath, publicKey]);
      await unlink(tempPath);

      return result === 'true';
    } catch (error) {
      throw new Error(`Failed to verify biometric: ${error.message}`);
    }
  }
}

