class PitchShifterProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        const pitch = parameters.pitch[0];

        for (let channel = 0; channel < input.length; channel++) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];

            for (let i = 0; i < inputChannel.length; i++) {
                const index = i * pitch;
                const floorIndex = Math.floor(index);
                const remainder = index - floorIndex;

                const lowerSample = inputChannel[floorIndex];
                const upperSample = inputChannel[floorIndex + 1] || 0;

                outputChannel[i] = lowerSample + (upperSample - lowerSample) * remainder;
            }
        }

        return true;
    }
}

registerProcessor('pitch-shifter-processor', PitchShifterProcessor);
