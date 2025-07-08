function ShowPopover(popup, element, evt, feature, content) {
    const coordinate = evt.coordinate;
    popup.setPosition(coordinate);
    DisposePopover(element)
    const popover = new bootstrap.Popover(element, {
        animation: true,
        container: element,
        content: content,
        html: true,
        placement: 'top',
        title: feature.get("sensor_name"),
    });
    popover.show();
}

function DisposePopover(element) {
    let popover = bootstrap.Popover.getInstance(element);
    if (popover) {
      popover.dispose();
    }
}

export {ShowPopover, DisposePopover}