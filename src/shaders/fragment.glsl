uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vNoise;

void main() {
    vec3 color = mix(uColorA, uColorB, vNoise * 2.0 + 0.5);
    gl_FragColor = vec4(color, 1.0);
}