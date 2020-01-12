import React, { Component } from 'react';

interface IProps {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
}

export default class Identicon extends Component<IProps> {

    private identicon: any;

    componentDidMount() {
        this.generateIdenticon();
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps !== this.props) {
            this.generateIdenticon();
        }
    }

    generateIdenticon() {
        // NOTE --  Majority of this code is referenced from: https://github.com/alexvandesande/blockies
        //          Mostly to ensure congruence to Ethereum Mist's Identicons

        // The random number is a js implementation of the Xorshift PRNG
        const randSeed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

        function seedRand(seedValue: string) {
            for (let i = 0; i < randSeed.length; i++) {
                randSeed[i] = 0;
            }
            for (let i = 0; i < seedValue.length; i++) {
                randSeed[i % 4] = ((randSeed[i % 4] << 5) - randSeed[i % 4]) + seed.charCodeAt(i);
            }
        }

        function rand() {
            // based on Java's String.hashCode(), expanded to 4 32bit values
            const t = randSeed[0] ^ (randSeed[0] << 11);

            randSeed[0] = randSeed[1];
            randSeed[1] = randSeed[2];
            randSeed[2] = randSeed[3];
            randSeed[3] = (randSeed[3] ^ (randSeed[3] >> 19) ^ t ^ (t >> 8));

            return (randSeed[3] >>> 0) / ((1 << 31) >>> 0);
        }

        function createColor() {
            // saturation is the whole color spectrum
            const h = Math.floor(rand() * 360);
            // saturation goes from 40 to 100, it avoids greyish colors
            const s = ((rand() * 60) + 40) + '%';
            // lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
            const l = ((rand() + rand() + rand() + rand()) * 25) + '%';

            return 'hsl(' + h + ',' + s + ',' + l + ')';
        }

        function createImageData(imgSize: any) {
            const width = imgSize; // Only support square icons for now
            const height = imgSize;

            const dataWidth = Math.ceil(width / 2);
            const mirrorWidth = width - dataWidth;

            const data: any[] = [];
            for (let y = 0; y < height; y++) {
                let row = [];
                for (let x = 0; x < dataWidth; x++) {
                    // this makes foreground and background color to have a 43% (1/2.3) probability
                    // spot color has 13% chance
                    row[x] = Math.floor(rand() * 2.3);
                }
                const r = row.slice(0, mirrorWidth);
                r.reverse();
                row = row.concat(data.push(r));

                row.map((rowItem) => data.push(rowItem));
            }

            return data;
        }

        function setCanvas(cIdenticon: any, cImageData: any, cColor: any, cScale: any, cBgColor: any, cSpotColor: any) {
            const width = Math.sqrt(cImageData.length);
            const s = width * cScale;

            cIdenticon.width = s;
            cIdenticon.style.width = `${s}px`;

            cIdenticon.height = s;
            cIdenticon.style.height = `${s}px`;

            const cc = cIdenticon.getContext('2d');
            cc.fillStyle = cBgColor;
            cc.fillRect(0, 0, cIdenticon.width, cIdenticon.height);
            cc.fillStyle = cColor;

            for (let i = 0; i < cImageData.length; i++) {
                // if data is 2, choose spot color, if 1 choose foreground
                cc.fillStyle = (cImageData[i] === 1) ? cColor : cSpotColor;

                // if data is 0, leave the background
                if (cImageData[i]) {
                    const row = Math.floor(i / width);
                    const col = i % width;

                    cc.fillRect(col * cScale, row * cScale, cScale, cScale);
                }
            }
        }

        const size = this.props.size || 8;
        const scale = this.props.scale || 4;
        const seed = this.props.seed || Math.floor((Math.random() * Math.pow(10, 16))).toString(16);

        seedRand(seed);

        const color = this.props.color || createColor();
        const bgColor = this.props.bgColor || createColor();
        const spotColor = this.props.spotColor || createColor();
        const imageData = createImageData(size);
        const canvas = setCanvas(this.identicon, imageData, color, scale, bgColor, spotColor);

        return canvas;
    }

        render() {
        return (
            <canvas
                ref={(identicon) => { this.identicon = identicon; }}
                className={this.props.className}
            />
        );
    }
}
