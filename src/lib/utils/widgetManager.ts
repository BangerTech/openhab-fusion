// Neue Widget-Manager-Klasse
export class WidgetManager {
  static validateWidget(widget: any) {
    const required = ['id', 'type', 'x', 'y', 'w', 'h'];
    return required.every(prop => widget.hasOwnProperty(prop));
  }

  static sanitizeWidget(widget: any) {
    return {
      id: widget.id,
      type: widget.type,
      x: Math.max(0, widget.x),
      y: Math.max(0, widget.y),
      w: Math.max(1, widget.w),
      h: Math.max(1, widget.h),
      item: widget.item,
      options: widget.options || {}
    };
  }
} 