import React, { PureComponent } from 'react'
import PropTypes from "prop-types";
import ReactTimeout from 'react-timeout'
import {
    Text,
} from 'native-base';

const HALF_RAD = Math.PI/2;

class AnimateNumber extends PureComponent {
    static TimingFunctions = {
        linear: (interval, progress) => {
            return interval
        },

        easeOut: (interval, progress) => {
            return interval * Math.sin(HALF_RAD * progress) * 5
        },

        easeIn: (interval, progress) => {
            return interval * Math.sin((HALF_RAD - HALF_RAD * progress)) * 5
        },
    };

    /**
     * Need animation.
     * @type {bool}
     */
    dirty;
    /**
     * Animation direction, true means positive, false means negative.
     * @type {bool}
     */
    direction;
    /**
     * Start value of last animation.
     * @type {number}
     */
    startFrom;
    /**
    * End value of last animation.
    * @type {number}
     */
    endWith;

    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            displayValue: 0,
        };
        this.dirty = false;
        this.startFrom = 0;
        this.endWith = 0;
    }

    getAnimationProgress = () => {
        return (this.state.value - this.startFrom) / (this.endWith - this.startFrom);
    };

    getTimingFunction = (interval, progress) => {
        if (typeof this.props.timing === 'string') {
            let fn = AnimateNumber.TimingFunctions[this.props.timing];
            return fn(interval, progress);
        } else if (typeof this.props.timing === 'function') {
            return this.props.timing(interval, progress);
        } else {
            return AnimateNumber.TimingFunctions['linear'](interval, progress);
        }
    };

    startAnimate = () => {
        let progress = this.getAnimationProgress();

        this.props.setTimeout(() => {
            let value = (this.endWith - this.startFrom) / this.props.steps;
            if (this.props.countBy) {
                value = Math.sign(value) * Math.abs(this.props.countBy);
            }
            let total = parseFloat(this.state.value) + parseFloat(value);

            this.direction = (value > 0);

            // animation terminate condition
            if (((this.direction) ^ (total <= this.endWith)) === 1) {
                this.dirty = false;
                total = this.endWith;
                
                this.props.onFinish(total, this.props.formatter(total));
            }

            if (this.props.onProgress) {
                this.props.onProgress(this.state.value, total);
            }

            this.setState({
                value: total,
                displayValue: this.props.formatter(total),
            });
        }, this.getTimingFunction(this.props.interval, progress));
    };

    componentDidMount() {
        this.startFrom = this.state.value;
        this.endWith = this.props.value;
        this.dirty = true;

        this.startAnimate();
    }

    componentWillUpdate(nextProps, nextState) {
        // check if restart animation
        if (this.props.value !== nextProps.value) {
            this.startFrom = this.props.value;
            this.endWith = nextProps.value;
            this.dirty = true;
            this.startAnimate();
            return;
        }

        // check if iterate animation frame
        if (!this.dirty) return;
        if (this.direction === true) {
            if (parseFloat(this.state.value) <= parseFloat(this.props.value)) {
                this.startAnimate();
            }
        } else if (this.direction === false) {
            if (parseFloat(this.state.value) >= parseFloat(this.props.value)) {
                this.startAnimate();
            }
        }
    }

    render() {
        if (this.props.render) {
            return this.props.render(this.state.displayValue);
        } else {
            return (
                <Text {...this.props} >
                    {this.state.displayValue}
                </Text>
            );    
        }
    }
}

AnimateNumber.propTypes = {
    countBy: PropTypes.number,
    interval: PropTypes.number,
    steps: PropTypes.number,
    value: PropTypes.number.isRequired,
    render: PropTypes.func, // (displayValue) => component
    timing: PropTypes.oneOfType([
        PropTypes.string,   // 'linear' | 'easeOut' | 'easeIn'
        PropTypes.func,     // (interval, progress) => number
    ]).isRequired,
    formatter: PropTypes.func,  // () => {}
    onProgress: PropTypes.func,  // () => {}
    onFinish: PropTypes.func,  // () => {}
};

AnimateNumber.defaultProps = {
    interval : 14,
    timing : 'linear',
    steps : 45,
    value : 0,
    render : null,
    formatter : (val) => val,
    onFinish : () => {},
};

export default ReactTimeout(AnimateNumber);
