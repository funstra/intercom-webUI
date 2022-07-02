export default function (node: HTMLElement) {
    function handleClick(e: Event) {
        if (!e.composedPath().includes(node)) {
            node.dispatchEvent(new CustomEvent("outclick"))
        }
    }
    document.addEventListener('click', handleClick, true)
    return {
        destroy() {
            document.removeEventListener('click', handleClick)
        }
    }
}