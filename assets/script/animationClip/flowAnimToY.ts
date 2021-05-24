import { AnimationClip } from "cc"

export default (toY: number): AnimationClip => {
    const $ = new AnimationClip()
    $.duration = 0.6
    $.keys = [[0, 0.6]]
    $.commonTargets = [
        {
            modifiers: ["position"],
        },
    ]
    $.curves = [
        {
            modifiers: ["y"],
            data: {
                keys: 0,
                values: [355, toY],
            },
            commonTarget: 0,
        },
    ]

    return $
}
