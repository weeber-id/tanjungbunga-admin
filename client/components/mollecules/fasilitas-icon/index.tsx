interface FasilitasIconProps {
  text?: string;
  Icon?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  src?: string;
}

const FasilitasIcon: React.FC<FasilitasIconProps> = ({ Icon, text, src }) => {
  return (
    <div className="flex items-center">
      {Icon && !src && <Icon className="mr-3" />}
      {src && (
        <img
          style={{ height: 38, width: 38 }}
          className="object-center object-cover mr-3"
          src={src}
          alt={`icon ${text}`}
        />
      )}
      <span className="text-black lg:text-body text-body-sm font-medium">{text}</span>
    </div>
  );
};

export default FasilitasIcon;
